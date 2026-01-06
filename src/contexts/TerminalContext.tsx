'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import { TerminalEntry } from '@/types/terminal';
import { terminalConfig } from '@/config';
import { createCommandExecutor } from '@/services';
import { getAllCommands } from '@/commands';
import { useTheme } from '@/contexts/ThemeContext';
import { portfolioData } from '@/data';
import {
  saveCommandHistory,
  loadCommandHistory,
  saveTerminalHistory,
  loadTerminalHistory,
  clearTerminalHistory,
  cleanupHistory,
} from '@/utils/terminal-persistence';

interface TerminalContextType {
  // State
  history: TerminalEntry[];
  commandHistory: string[];
  isLoading: boolean;
  height: number;
  isInitialized: boolean;
  restoredHistoryCount: number;
  
  // Actions
  setHistory: React.Dispatch<React.SetStateAction<TerminalEntry[]>>;
  setCommandHistory: React.Dispatch<React.SetStateAction<string[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  handleClear: () => void;
  handleCommandSubmit: (command: string, onNavigate?: (section: string) => void, showGuide?: () => void) => Promise<void>;
  
  // Command executor
  executor: any;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

interface TerminalProviderProps {
  children: ReactNode;
}

export const TerminalProvider: React.FC<TerminalProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<TerminalEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [height, setHeight] = useState(terminalConfig.terminal.defaultHeight);
  const [isInitialized, setIsInitialized] = useState(false);
  const [restoredHistoryCount, setRestoredHistoryCount] = useState(0);
  
  const { setTheme } = useTheme();

  // Initialize terminal state on mount
  useEffect(() => {
    if (!isInitialized) {
      // Load command history from session storage
      const savedCommandHistory = loadCommandHistory(terminalConfig.terminal.maxCommandHistory);
      if (savedCommandHistory.length > 0) {
        setCommandHistory(savedCommandHistory);
      }

      // Load terminal output history from session storage
      const savedHistory = loadTerminalHistory(terminalConfig.terminal.maxHistoryEntries);
      if (savedHistory.length > 0) {
        setHistory(savedHistory);
        setRestoredHistoryCount(savedHistory.length);
      }

      // Cleanup old history entries on load
      cleanupHistory(
        terminalConfig.terminal.maxCommandHistory,
        terminalConfig.terminal.maxHistoryEntries
      );

      setIsInitialized(true);
      
      // Add welcome message if no history exists
      if (savedHistory.length === 0) {
        const welcomeEntry = {
          id: `welcome-${Date.now()}`,
          command: '',
          output: `Welcome to the Portfolio Terminal! 🚀
        
Type 'help' to see available commands.
Type 'send-message' to contact me.
Press \` (backtick) to toggle this terminal.`,
          timestamp: new Date(),
          type: 'info' as const,
        };
        setHistory([welcomeEntry]);
      }
    }
  }, [isInitialized]);

  // Save command history to session storage whenever it changes
  useEffect(() => {
    if (isInitialized && commandHistory.length > 0) {
      saveCommandHistory(commandHistory, terminalConfig.terminal.maxCommandHistory);
    }
  }, [commandHistory, isInitialized]);

  // Save terminal history to session storage whenever it changes
  useEffect(() => {
    if (isInitialized && history.length > 0) {
      saveTerminalHistory(history, terminalConfig.terminal.maxHistoryEntries);
    }
  }, [history, isInitialized]);

  // Create command executor with context
  const executor = useMemo(() => {
    const exec = createCommandExecutor({
      navigateToSection: undefined, // Will be set dynamically
      setTheme,
      portfolioData,
      commandHistory,
      commandExecutor: null,
      showGuide: undefined // Will be set dynamically
    });
    
    // Register all commands
    exec.registerCommands(getAllCommands());
    
    // Set self-reference for help command
    exec.updateContext({ commandExecutor: exec });
    
    return exec;
  }, [setTheme, commandHistory]);

  // Update context when commandHistory changes
  useEffect(() => {
    executor.updateContext({ commandHistory });
  }, [commandHistory, executor]);

  // Handle clear terminal
  const handleClear = () => {
    setHistory([]);
    setRestoredHistoryCount(0);
    clearTerminalHistory();
  };

  // Handle command submission
  const handleCommandSubmit = async (
    command: string, 
    onNavigate?: (section: string) => void, 
    showGuide?: () => void
  ) => {
    // Update executor context with current callbacks
    executor.updateContext({ 
      navigateToSection: onNavigate,
      showGuide 
    });

    // Add command to history with size limit
    setCommandHistory(prev => {
      const newHistory = [...prev, command];
      if (newHistory.length > terminalConfig.terminal.maxCommandHistory) {
        return newHistory.slice(-terminalConfig.terminal.maxCommandHistory);
      }
      return newHistory;
    });

    // Add command entry to output
    const commandEntry: TerminalEntry = {
      id: `cmd-${Date.now()}`,
      command,
      output: '',
      timestamp: new Date(),
      type: 'info',
      isLoading: true,
    };

    setHistory(prev => [...prev, commandEntry]);
    setIsLoading(true);

    try {
      // Execute command using CommandExecutor
      const result = await executor.executeCommand(command);
      
      // Handle special commands
      if (result.data?.action === 'clear') {
        handleClear();
        setIsLoading(false);
        return;
      }
      
      // Add result to history
      const resultEntry: TerminalEntry = {
        id: `result-${Date.now()}`,
        command: '',
        output: result.output,
        timestamp: new Date(),
        type: result.type,
      };

      setHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          isLoading: false,
        };
        return [...updated, resultEntry];
      });
      
    } catch (error) {
      // Handle execution error
      const errorEntry: TerminalEntry = {
        id: `error-${Date.now()}`,
        command: '',
        output: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        type: 'error',
      };

      setHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          isLoading: false,
        };
        return [...updated, errorEntry];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: TerminalContextType = {
    history,
    commandHistory,
    isLoading,
    height,
    isInitialized,
    restoredHistoryCount,
    setHistory,
    setCommandHistory,
    setIsLoading,
    setHeight,
    handleClear,
    handleCommandSubmit,
    executor,
  };

  return (
    <TerminalContext.Provider value={contextValue}>
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = (): TerminalContextType => {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
};

export default TerminalContext;