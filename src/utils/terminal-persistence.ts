/**
 * Terminal State Persistence Utility
 * 
 * Handles saving and restoring terminal state to/from session storage.
 * Implements requirements 9.1, 9.2, 9.3, 9.4
 */

import { TerminalEntry } from '@/types/terminal';

const STORAGE_KEYS = {
  COMMAND_HISTORY: 'terminal_command_history',
  TERMINAL_HISTORY: 'terminal_history',
  TERMINAL_VISIBLE: 'terminal_visible',
} as const;

/**
 * Save command history to session storage
 * Requirement 9.1: Store command history in session storage
 */
export function saveCommandHistory(commands: string[], maxSize: number = 50): void {
  try {
    // Limit to most recent commands
    const limitedCommands = commands.slice(-maxSize);
    sessionStorage.setItem(STORAGE_KEYS.COMMAND_HISTORY, JSON.stringify(limitedCommands));
  } catch (error) {
    console.error('Failed to save command history:', error);
  }
}

/**
 * Load command history from session storage
 * Requirement 9.2: Restore previous terminal state
 */
export function loadCommandHistory(maxSize: number = 50): string[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEYS.COMMAND_HISTORY);
    if (!stored) return [];
    
    const commands = JSON.parse(stored) as string[];
    
    // Ensure we don't exceed max size
    return commands.slice(-maxSize);
  } catch (error) {
    console.error('Failed to load command history:', error);
    return [];
  }
}

/**
 * Save terminal output history to session storage
 * Requirement 9.1: Store terminal state in session storage
 */
export function saveTerminalHistory(history: TerminalEntry[], maxSize: number = 100): void {
  try {
    // Limit to most recent entries
    const limitedHistory = history.slice(-maxSize);
    
    // Serialize with date conversion
    const serialized = limitedHistory.map(entry => ({
      ...entry,
      timestamp: entry.timestamp.toISOString(),
    }));
    
    sessionStorage.setItem(STORAGE_KEYS.TERMINAL_HISTORY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save terminal history:', error);
  }
}

/**
 * Load terminal output history from session storage
 * Requirement 9.2: Restore previous terminal state
 */
export function loadTerminalHistory(maxSize: number = 100): TerminalEntry[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEYS.TERMINAL_HISTORY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Deserialize with date conversion
    const history = parsed.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
      isLoading: false, // Reset loading state on restore
    })) as TerminalEntry[];
    
    // Ensure we don't exceed max size
    return history.slice(-maxSize);
  } catch (error) {
    console.error('Failed to load terminal history:', error);
    return [];
  }
}

/**
 * Save terminal visibility state
 * Requirement 9.2: Restore previous terminal state
 */
export function saveTerminalVisible(isVisible: boolean): void {
  try {
    sessionStorage.setItem(STORAGE_KEYS.TERMINAL_VISIBLE, JSON.stringify(isVisible));
  } catch (error) {
    console.error('Failed to save terminal visibility:', error);
  }
}

/**
 * Load terminal visibility state
 * Requirement 9.2: Restore previous terminal state
 */
export function loadTerminalVisible(): boolean | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEYS.TERMINAL_VISIBLE);
    if (!stored) return null;
    
    return JSON.parse(stored) as boolean;
  } catch (error) {
    console.error('Failed to load terminal visibility:', error);
    return null;
  }
}

/**
 * Clear all terminal state from session storage
 * Requirement 9.4: Clear terminal output but preserve history
 */
export function clearTerminalHistory(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.TERMINAL_HISTORY);
  } catch (error) {
    console.error('Failed to clear terminal history:', error);
  }
}

/**
 * Clear command history from session storage
 * Requirement 9.3: Limit history to most recent 50 commands
 */
export function clearCommandHistory(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.COMMAND_HISTORY);
  } catch (error) {
    console.error('Failed to clear command history:', error);
  }
}

/**
 * Clear all terminal-related data from session storage
 */
export function clearAllTerminalData(): void {
  clearTerminalHistory();
  clearCommandHistory();
  try {
    sessionStorage.removeItem(STORAGE_KEYS.TERMINAL_VISIBLE);
  } catch (error) {
    console.error('Failed to clear terminal visibility:', error);
  }
}

/**
 * Cleanup old history entries to maintain size limits
 * Requirement 9.3: Limit history to most recent commands
 */
export function cleanupHistory(maxCommandSize: number = 50, maxHistorySize: number = 100): void {
  try {
    // Cleanup command history
    const commands = loadCommandHistory();
    if (commands.length > maxCommandSize) {
      saveCommandHistory(commands, maxCommandSize);
    }
    
    // Cleanup terminal history
    const history = loadTerminalHistory();
    if (history.length > maxHistorySize) {
      saveTerminalHistory(history, maxHistorySize);
    }
  } catch (error) {
    console.error('Failed to cleanup history:', error);
  }
}
