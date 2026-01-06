/**
 * Central export for all terminal commands
 */

import { Command } from '@/types/terminal';
import { getCoreCommands } from './core-commands';
import { getInfoCommands } from './info-commands';
import { getActionCommands } from './action-commands';

/**
 * Get all available commands
 */
export function getAllCommands(): Command[] {
  return [
    ...getCoreCommands(),
    ...getInfoCommands(),
    ...getActionCommands()
  ];
}

// Re-export individual command modules
export * from './core-commands';
export * from './info-commands';
export * from './action-commands';

export default {
  getAllCommands
};
