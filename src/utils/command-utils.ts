import { CommandHandlerService, createCommandHandler } from '@/services/command-handler';
import { portfolioData } from '@/data/portfolio';

/**
 * Singleton instance of the command handler
 */
let commandHandlerInstance: CommandHandlerService | null = null;

/**
 * Get the singleton command handler instance
 */
export function getCommandHandler(): CommandHandlerService {
  if (!commandHandlerInstance) {
    commandHandlerInstance = createCommandHandler(portfolioData);
  }
  return commandHandlerInstance;
}

/**
 * Execute a command using the singleton handler
 */
export function executeCommand(command: string) {
  return getCommandHandler().executeCommand(command);
}

/**
 * Get all available commands
 */
export function getAvailableCommands(): string[] {
  return getCommandHandler().getAvailableCommands();
}