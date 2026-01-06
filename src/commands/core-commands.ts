import { Command, CommandResult } from '@/types/terminal';

/**
 * Core terminal commands: help, clear, history
 * 
 * Requirements: 4.1, 4.2, 9.5
 */

/**
 * Help command - Display all available commands
 * Requirement 4.1: WHEN a user types "help" THEN the Terminal System SHALL display all available commands with descriptions
 */
export const helpCommand: Command = {
  name: 'help',
  description: 'Display all available commands',
  usage: 'help [command]',
  aliases: ['?', 'commands'],
  
  execute: async (args, context) => {
    // If a specific command is requested, show detailed help for that command
    if (args.length > 0) {
      const commandName = args[0];
      const executor = context?.commandExecutor;
      
      if (executor) {
        const command = executor.getCommand(commandName);
        
        if (command) {
          let output = `╭─────────────────────────────────────────────────────────────╮\n`;
          output += `│  Command: ${command.name.padEnd(48)} │\n`;
          output += `╰─────────────────────────────────────────────────────────────╯\n\n`;
          output += `Description: ${command.description}\n`;
          output += `Usage: ${command.usage}\n`;
          
          if (command.aliases && command.aliases.length > 0) {
            output += `Aliases: ${command.aliases.join(', ')}\n`;
          }
          
          return {
            success: true,
            output,
            type: 'info'
          };
        } else {
          return {
            success: false,
            output: `Command '${commandName}' not found.\n\nType 'help' to see all available commands.`,
            type: 'error'
          };
        }
      }
    }
    
    // Get all commands from the executor if available
    const executor = context?.commandExecutor;
    let commandsList = '';
    
    if (executor) {
      const allCommands = executor.getAllCommands();
      
      // Group commands by category
      const infoCommands = allCommands.filter((cmd: Command) => 
        ['about', 'skills', 'experience', 'projects', 'contact'].includes(cmd.name)
      );
      const navCommands = allCommands.filter((cmd: Command) => 
        ['goto'].includes(cmd.name)
      );
      const actionCommands = allCommands.filter((cmd: Command) => 
        ['theme', 'download-resume', 'open-github', 'open-linkedin'].includes(cmd.name)
      );
      const utilityCommands = allCommands.filter((cmd: Command) => 
        ['help', 'clear', 'history', 'guide'].includes(cmd.name)
      );
      
      // Build command list
      if (infoCommands.length > 0) {
        commandsList += '\n📋 Information Commands:\n';
        infoCommands.forEach((cmd: Command) => {
          commandsList += `  ${cmd.name.padEnd(18)} ${cmd.description}\n`;
        });
      }
      
      if (navCommands.length > 0) {
        commandsList += '\n🧭 Navigation:\n';
        navCommands.forEach((cmd: Command) => {
          commandsList += `  ${cmd.name.padEnd(18)} ${cmd.description}\n`;
        });
      }
      
      if (actionCommands.length > 0) {
        commandsList += '\n🎨 Actions:\n';
        actionCommands.forEach((cmd: Command) => {
          commandsList += `  ${cmd.name.padEnd(18)} ${cmd.description}\n`;
        });
      }
      
      if (utilityCommands.length > 0) {
        commandsList += '\n🛠️  Utility:\n';
        utilityCommands.forEach((cmd: Command) => {
          commandsList += `  ${cmd.name.padEnd(18)} ${cmd.description}\n`;
        });
      }
    }
    
    // Show all commands
    const output = `
╭─────────────────────────────────────────────────────────────╮
│                  Available Commands                         │
╰─────────────────────────────────────────────────────────────╯
${commandsList}
💡 Tips:
  • Press ↑/↓ to navigate command history
  • Press \` (backtick) to toggle terminal
  • Press Esc to close terminal
  • Press Ctrl+L to clear terminal
  • Press Ctrl+C to cancel current input

Type 'help <command>' for detailed information about a specific command.
`;
    
    return {
      success: true,
      output: output.trim(),
      type: 'info'
    };
  }
};

/**
 * Clear command - Clear terminal output
 * Requirement 4.1: Part of core utility commands
 */
export const clearCommand: Command = {
  name: 'clear',
  description: 'Clear terminal output',
  usage: 'clear',
  aliases: ['cls'],
  
  execute: async () => {
    return {
      success: true,
      output: 'CLEAR_TERMINAL', // Special signal to clear the terminal
      type: 'success',
      data: { action: 'clear' }
    };
  }
};

/**
 * History command - Show command history
 * Requirement 9.5: WHEN a user types "history" THEN the Terminal System SHALL display all previous commands
 */
export const historyCommand: Command = {
  name: 'history',
  description: 'Show command history',
  usage: 'history',
  
  execute: async (_args, context) => {
    // Get command history from context
    const commandHistory = context?.commandHistory || [];
    
    if (commandHistory.length === 0) {
      return {
        success: true,
        output: 'No command history yet.\n\nStart typing commands to build your history!',
        type: 'info'
      };
    }
    
    // Format the history with line numbers
    let output = '╭─────────────────────────────────────────────────────────────╮\n';
    output += '│                   Command History                           │\n';
    output += '╰─────────────────────────────────────────────────────────────╯\n\n';
    
    commandHistory.forEach((cmd, index) => {
      const lineNum = (index + 1).toString().padStart(3, ' ');
      output += `${lineNum}  ${cmd}\n`;
    });
    
    output += `\n💡 Tip: Use ↑/↓ arrow keys to navigate through history`;
    
    return {
      success: true,
      output,
      type: 'info',
      data: { action: 'show-history' }
    };
  }
};

/**
 * Guide command - Show the portfolio guide
 * Requirement 3.1: WHEN a user types "guide" in the terminal THEN the Terminal System SHALL display the Portfolio Guide
 */
export const guideCommand: Command = {
  name: 'guide',
  description: 'Show the portfolio guide',
  usage: 'guide',
  aliases: ['tutorial', 'help-guide'],
  
  execute: async (_args, context) => {
   
    // Trigger guide display through context callback
    if (context?.showGuide) {
      context.showGuide();
      
      return {
        success: true,
        output: '✓ Opening portfolio guide...',
        type: 'success',
        data: { action: 'show-guide' }
      };
    } else {
      // Fallback if showGuide callback is not available
      return {
        success: false,
        output: 'Guide is not available. Please refresh the page and try again.',
        type: 'error'
      };
    }
  }
};

/**
 * Get all core commands
 */
export function getCoreCommands(): Command[] {
  return [
    helpCommand,
    clearCommand,
    historyCommand,
    guideCommand
  ];
}

export default {
  helpCommand,
  clearCommand,
  historyCommand,
  guideCommand,
  getCoreCommands
};
