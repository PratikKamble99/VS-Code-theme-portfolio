import { Command, CommandResult, CommandContext } from '@/types/terminal';

/**
 * CommandExecutor - Service for parsing and executing terminal commands
 * 
 * Features:
 * - Command parsing and validation
 * - Command registry system
 * - Command execution pipeline
 * - Error handling and suggestions
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
export class CommandExecutor {
  private commands: Map<string, Command> = new Map();
  private aliases: Map<string, string> = new Map();
  private context: CommandContext;

  constructor(context: CommandContext = {}) {
    this.context = context;
  }

  /**
   * Register a new command
   */
  registerCommand(command: Command): void {
    this.commands.set(command.name, command);
    
    // Register aliases
    if (command.aliases) {
      command.aliases.forEach(alias => {
        this.aliases.set(alias, command.name);
      });
    }
  }

  /**
   * Register multiple commands at once
   */
  registerCommands(commands: Command[]): void {
    commands.forEach(cmd => this.registerCommand(cmd));
  }

  /**
   * Get a command by name or alias
   */
  getCommand(nameOrAlias: string): Command | undefined {
    // Check if it's a direct command name
    if (this.commands.has(nameOrAlias)) {
      return this.commands.get(nameOrAlias);
    }
    
    // Check if it's an alias
    const commandName = this.aliases.get(nameOrAlias);
    if (commandName) {
      return this.commands.get(commandName);
    }
    
    return undefined;
  }

  /**
   * Get all registered commands
   */
  getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  /**
   * Parse command string into command name and arguments
   */
  parseCommand(input: string): { command: string; args: string[] } {
    const trimmed = input.trim();
    
    // Handle quoted arguments
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i];
      
      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = '';
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          parts.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    if (current) {
      parts.push(current);
    }
    
    const [command, ...args] = parts;
    return { command: command || '', args };
  }

  /**
   * Calculate Levenshtein distance between two strings
   * Used for command suggestions
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }

  /**
   * Find similar commands for suggestions
   */
  findSimilarCommands(input: string, threshold: number = 2): string[] {
    const allNames = [
      ...Array.from(this.commands.keys()),
      ...Array.from(this.aliases.keys())
    ];
    
    const suggestions = allNames
      .map(name => ({
        name,
        distance: this.levenshteinDistance(input.toLowerCase(), name.toLowerCase())
      }))
      .filter(item => item.distance <= threshold)
      .sort((a, b) => a.distance - b.distance)
      .map(item => item.name);
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
  }

  /**
   * Validate command arguments
   */
  private validateCommand(command: Command, args: string[]): boolean {
    if (command.validate) {
      return command.validate(args);
    }
    return true;
  }

  /**
   * Execute a command
   */
  async executeCommand(input: string): Promise<CommandResult> {
    try {
      // Parse the command
      const { command: commandName, args } = this.parseCommand(input);
      
      if (!commandName) {
        return {
          success: false,
          output: 'No command entered.',
          type: 'error'
        };
      }
      
      // Get the command
      const command = this.getCommand(commandName);
      
      if (!command) {
        // Command not found - suggest similar commands
        const suggestions = this.findSimilarCommands(commandName);
        
        let output = `Command '${commandName}' not found.`;
        
        if (suggestions.length > 0) {
          output += `\n\nDid you mean:\n${suggestions.map(s => `  • ${s}`).join('\n')}`;
        }
        
        output += `\n\nType 'help' to see all available commands.`;
        
        return {
          success: false,
          output,
          type: 'error'
        };
      }
      
      // Validate arguments
      if (!this.validateCommand(command, args)) {
        return {
          success: false,
          output: `Invalid arguments for '${commandName}'.\n\nUsage: ${command.usage}`,
          type: 'error'
        };
      }
      
      // Execute the command
      const result = await command.execute(args, this.context);
      
      return result;
      
    } catch (error) {
      console.error('Command execution error:', error);
      
      return {
        success: false,
        output: `An error occurred while executing the command: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      };
    }
  }

  /**
   * Update the command context
   */
  updateContext(newContext: Partial<CommandContext>): void {
    this.context = { ...this.context, ...newContext };
  }

  /**
   * Get command suggestions for autocomplete
   */
  getCommandSuggestions(partial: string): string[] {
    if (!partial) {
      return [];
    }
    
    const allNames = [
      ...Array.from(this.commands.keys()),
      ...Array.from(this.aliases.keys())
    ];
    
    return allNames
      .filter(name => name.toLowerCase().startsWith(partial.toLowerCase()))
      .sort()
      .slice(0, 5);
  }
}

/**
 * Create a new CommandExecutor instance with context
 */
export function createCommandExecutor(context: CommandContext = {}): CommandExecutor {
  return new CommandExecutor(context);
}

export default CommandExecutor;
