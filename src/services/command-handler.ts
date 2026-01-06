/**
 * Command Handler Service - Central command processing and execution
 * 
 * Features:
 * - Command parsing and validation
 * - Command execution with context
 * - Command history management
 * - Auto-completion support
 * - Error handling and formatting
 */

import { Command, CommandResult, CommandContext } from '@/types/terminal';
import { PortfolioData } from '@/types';
import { getAllCommands } from '@/commands';

export interface CommandHandlerService {
  executeCommand(input: string): Promise<CommandResult>;
  getAvailableCommands(): string[];
  getCommandSuggestions(partial: string): string[];
  getCommand(name: string): Command | undefined;
  getCommandHelp(commandName?: string): CommandResult;
}

class CommandHandler implements CommandHandlerService {
  private commands: Map<string, Command> = new Map();
  private aliases: Map<string, string> = new Map();
  private portfolioData: PortfolioData;
  private context: CommandContext;

  constructor(portfolioData: PortfolioData, context?: Partial<CommandContext>) {
    this.portfolioData = portfolioData;
    this.context = {
      portfolioData,
      commandHistory: [],
      ...context
    };
    
    this.initializeCommands();
  }

  /**
   * Initialize all commands and their aliases
   */
  private initializeCommands(): void {
    const allCommands = getAllCommands();
    
    for (const command of allCommands) {
      // Register main command name
      this.commands.set(command.name.toLowerCase(), command);
      
      // Register aliases
      if (command.aliases) {
        for (const alias of command.aliases) {
          this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
        }
      }
    }
  }

  /**
   * Parse command input into command name and arguments
   */
  private parseCommand(input: string): { command: string; args: string[] } {
    const trimmed = input.trim();
    if (!trimmed) {
      return { command: '', args: [] };
    }

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    return { command, args };
  }

  /**
   * Resolve command name (handle aliases)
   */
  private resolveCommandName(name: string): string {
    const lowerName = name.toLowerCase();
    return this.aliases.get(lowerName) || lowerName;
  }

  /**
   * Get a command by name or alias
   */
  getCommand(name: string): Command | undefined {
    const resolvedName = this.resolveCommandName(name);
    return this.commands.get(resolvedName);
  }

  /**
   * Execute a command with the given input
   */
  async executeCommand(input: string): Promise<CommandResult> {
    try {
      const { command: commandName, args } = this.parseCommand(input);
      
      if (!commandName) {
        return {
          success: false,
          output: 'Please enter a command. Type "help" for available commands.',
          type: 'info'
        };
      }

      const command = this.getCommand(commandName);
      
      if (!command) {
        const suggestions = this.getCommandSuggestions(commandName);
        let output = `Command '${commandName}' not found.`;
        
        if (suggestions.length > 0) {
          output += `\n\nDid you mean:\n${suggestions.slice(0, 3).map(s => `  • ${s}`).join('\n')}`;
        }
        
        output += '\n\nType "help" for all available commands.';
        
        return {
          success: false,
          output,
          type: 'error'
        };
      }

      // Validate command arguments if validator exists
      if (command.validate && !command.validate(args)) {
        return {
          success: false,
          output: `Invalid arguments for '${command.name}'.\n\nUsage: ${command.usage}`,
          type: 'error'
        };
      }

      // Execute the command
      const result = await command.execute(args, this.context);
      
      // Add command to history
      if (this.context.commandHistory) {
        this.context.commandHistory.push(input);
      }

      return result;
      
    } catch (error) {
      console.error('Command execution error:', error);
      
      return {
        success: false,
        output: `An error occurred while executing the command.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      };
    }
  }

  /**
   * Get all available command names
   */
  getAvailableCommands(): string[] {
    const commandNames: string[] = [];
    this.commands.forEach((command, name) => {
      commandNames.push(name);
    });
    return commandNames.sort();
  }

  /**
   * Get command suggestions based on partial input
   */
  getCommandSuggestions(partial: string): string[] {
    if (!partial) {
      return this.getAvailableCommands();
    }

    const lowerPartial = partial.toLowerCase();
    const suggestions: string[] = [];

    // Exact matches first
    this.commands.forEach((command, name) => {
      if (name.startsWith(lowerPartial)) {
        suggestions.push(name);
      }
    });

    // Alias matches
    this.aliases.forEach((commandName, alias) => {
      if (alias.startsWith(lowerPartial) && !suggestions.includes(commandName)) {
        suggestions.push(alias);
      }
    });

    // Fuzzy matches (contains the partial string)
    this.commands.forEach((command, name) => {
      if (name.includes(lowerPartial) && !suggestions.includes(name)) {
        suggestions.push(name);
      }
    });

    return suggestions.sort();
  }

  /**
   * Get help information for commands
   */
  getCommandHelp(commandName?: string): CommandResult {
    if (commandName) {
      const command = this.getCommand(commandName);
      
      if (!command) {
        return {
          success: false,
          output: `Command '${commandName}' not found. Type "help" for all available commands.`,
          type: 'error'
        };
      }

      let output = `${command.name} - ${command.description}\n\n`;
      output += `Usage: ${command.usage}`;
      
      if (command.aliases && command.aliases.length > 0) {
        output += `\nAliases: ${command.aliases.join(', ')}`;
      }

      return {
        success: true,
        output,
        type: 'info'
      };
    }

    // Show all commands
    const commandsArray: Command[] = [];
    this.commands.forEach((command) => {
      commandsArray.push(command);
    });
    const commands = commandsArray.sort((a, b) => a.name.localeCompare(b.name));

    let output = 'Available Commands:\n\n';
    
    // Group commands by category
    const coreCommands = commands.filter(cmd => 
      ['help', 'clear', 'history', 'guide'].includes(cmd.name)
    );
    const infoCommands = commands.filter(cmd => 
      ['about', 'skills', 'experience', 'projects', 'contact'].includes(cmd.name)
    );
    const actionCommands = commands.filter(cmd => 
      ['goto', 'theme', 'send-message', 'download-resume', 'open-github', 'open-linkedin'].includes(cmd.name)
    );

    if (coreCommands.length > 0) {
      output += 'Core Commands:\n';
      for (const cmd of coreCommands) {
        output += `  ${cmd.name.padEnd(15)} - ${cmd.description}\n`;
      }
      output += '\n';
    }

    if (infoCommands.length > 0) {
      output += 'Information Commands:\n';
      for (const cmd of infoCommands) {
        output += `  ${cmd.name.padEnd(15)} - ${cmd.description}\n`;
      }
      output += '\n';
    }

    if (actionCommands.length > 0) {
      output += 'Action Commands:\n';
      for (const cmd of actionCommands) {
        output += `  ${cmd.name.padEnd(15)} - ${cmd.description}\n`;
      }
      output += '\n';
    }

    output += 'Type "help <command>" for detailed information about a specific command.';

    return {
      success: true,
      output,
      type: 'info'
    };
  }

  /**
   * Update the command context
   */
  updateContext(newContext: Partial<CommandContext>): void {
    this.context = { ...this.context, ...newContext };
  }

  /**
   * Get the current context
   */
  getContext(): CommandContext {
    return { ...this.context };
  }
}

/**
 * Create a new command handler instance
 */
export function createCommandHandler(
  portfolioData: PortfolioData, 
  context?: Partial<CommandContext>
): CommandHandlerService {
  return new CommandHandler(portfolioData, context);
}

export { CommandHandler };
export default CommandHandler;