import { useState, useCallback } from 'react';

interface UseCommandHistoryOptions {
  maxHistorySize?: number;
}

export function useCommandHistory({ maxHistorySize = 100 }: UseCommandHistoryOptions = {}) {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Add a command to history
  const addCommand = useCallback((command: string) => {
    if (!command.trim()) return;
    
    setHistory(prev => {
      // Remove duplicate if it exists at the end
      const filtered = prev.filter(cmd => cmd !== command.trim());
      const newHistory = [...filtered, command.trim()];
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        return newHistory.slice(-maxHistorySize);
      }
      
      return newHistory;
    });
    
    // Reset index after adding new command
    setCurrentIndex(-1);
  }, [maxHistorySize]);

  // Navigate through history
  const navigateHistory = useCallback((direction: 'up' | 'down'): string => {
    if (history.length === 0) return '';

    let newIndex: number;
    
    if (direction === 'up') {
      // Go backwards in history (older commands)
      if (currentIndex === -1) {
        newIndex = history.length - 1;
      } else if (currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else {
        newIndex = currentIndex; // Stay at oldest command
      }
    } else {
      // Go forwards in history (newer commands)
      if (currentIndex === -1) {
        return ''; // Already at newest (empty)
      } else if (currentIndex < history.length - 1) {
        newIndex = currentIndex + 1;
      } else {
        newIndex = -1; // Go to empty (newest)
        setCurrentIndex(-1);
        return '';
      }
    }

    setCurrentIndex(newIndex);
    return history[newIndex] || '';
  }, [history, currentIndex]);

  // Get current command from history
  const getCurrentCommand = useCallback((): string => {
    if (currentIndex === -1 || currentIndex >= history.length) {
      return '';
    }
    return history[currentIndex];
  }, [history, currentIndex]);

  // Reset navigation index (useful when user starts typing)
  const resetNavigation = useCallback(() => {
    setCurrentIndex(-1);
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    history,
    currentIndex,
    addCommand,
    navigateHistory,
    getCurrentCommand,
    resetNavigation,
    clearHistory,
    hasHistory: history.length > 0
  };
}