'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalOutputProps, TerminalEntry } from '@/types/terminal';
import { CommandHistoryItem } from '@/types';

/**
 * TerminalOutput - Display command history and results
 * 
 * Features:
 * - Output display with syntax highlighting
 * - Different output types (success, error, info, warning)
 * - Auto-scroll to latest output
 * - Loading indicator for command execution
 * - Smooth animations for all state transitions
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

// Extended props to support both new and legacy Terminal components
interface ExtendedTerminalOutputProps {
  history: TerminalEntry[] | CommandHistoryItem[];
  isLoading?: boolean;
  enableAnimation?: boolean;
  animationSpeed?: number;
  restoredHistoryCount?: number; // Number of entries that were restored from storage
}

export const TerminalOutput: React.FC<ExtendedTerminalOutputProps> = ({
  history,
  isLoading = false,
  enableAnimation = false,
  animationSpeed = 40,
  restoredHistoryCount = 0,
}) => {
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries are added
  // Requirement 6.3: Implement auto-scroll to latest output with smooth behavior
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTo({
        top: outputRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history]);

  /**
   * Type guard to check if entry is TerminalEntry
   */
  const isTerminalEntry = (entry: TerminalEntry | CommandHistoryItem): entry is TerminalEntry => {
    return 'type' in entry;
  };

  /**
   * Get the appropriate text color based on entry type
   * Requirement 6.2: Display results with appropriate styling
   */
  const getOutputColor = (type?: TerminalEntry['type']): string => {
    switch (type) {
      case 'error':
        return 'text-[#f48771]'; // Red for errors
      case 'success':
        return 'text-[#4ec9b0]'; // Green for success
      case 'warning':
        return 'text-[#dcdcaa]'; // Yellow for warnings
      case 'info':
      default:
        return 'text-[#d4d4d4]'; // Default gray for info
    }
  };

  /**
   * Get the appropriate background glow based on entry type
   * Requirement 6.2: Enhanced visual feedback with subtle glows
   */
  const getOutputGlow = (type?: TerminalEntry['type']): string => {
    switch (type) {
      case 'error':
        return 'shadow-[0_0_10px_rgba(244,135,113,0.15)]';
      case 'success':
        return 'shadow-[0_0_10px_rgba(78,201,176,0.15)]';
      case 'warning':
        return 'shadow-[0_0_10px_rgba(220,220,170,0.15)]';
      case 'info':
      default:
        return '';
    }
  };

  /**
   * Get the appropriate icon based on entry type
   * Requirement 6.4: Display success/error icons with enhanced styling
   */
  const getOutputIcon = (type?: TerminalEntry['type']): JSX.Element => {
    const iconClass = "flex-shrink-0 mt-0.5 transition-all duration-300";
    
    switch (type) {
      case 'error':
        return (
          <span className={`${iconClass} text-[#f48771]`}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="animate-pulse">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </span>
        );
      case 'success':
        return (
          <span className={`${iconClass} text-[#4ec9b0]`}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
            </svg>
          </span>
        );
      case 'warning':
        return (
          <span className={`${iconClass} text-[#dcdcaa]`}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
          </span>
        );
      case 'info':
      default:
        return (
          <span className={`${iconClass} text-[#569cd6]`}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </span>
        );
    }
  };

  /**
   * Render loading indicator with enhanced animation
   * Requirement 6.1, 6.5: Display loading indicator during command execution
   */
  const renderLoadingIndicator = () => (
    <div className="flex gap-1 ml-2 items-center">
      <span 
        className="w-1.5 h-1.5 bg-[#4ec9b0] rounded-full animate-bounce" 
        style={{ animationDelay: '0ms', animationDuration: '1s' }}
      ></span>
      <span 
        className="w-1.5 h-1.5 bg-[#4ec9b0] rounded-full animate-bounce" 
        style={{ animationDelay: '150ms', animationDuration: '1s' }}
      ></span>
      <span 
        className="w-1.5 h-1.5 bg-[#4ec9b0] rounded-full animate-bounce" 
        style={{ animationDelay: '300ms', animationDuration: '1s' }}
      ></span>
    </div>
  );

  /**
   * Render a single terminal entry with smooth animations
   * Requirement 6.2, 6.3: Smooth transitions for all states
   */
  const renderEntry = (entry: TerminalEntry | CommandHistoryItem, index: number) => {
    const entryId = isTerminalEntry(entry) ? entry.id : `legacy-${entry.timestamp.getTime()}`;
    const isNew = index >= restoredHistoryCount; // Only animate entries that are new (not restored)
    const isLatest = index === history.length - 1;
    
    // Handle legacy CommandHistoryItem format
    if (!isTerminalEntry(entry)) {
      const legacyEntry = entry as CommandHistoryItem;
      return (
        <motion.div
          key={entryId}
          initial={isNew ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isNew ? 0.3 : 0, ease: [0.4, 0, 0.2, 1] }}
          className="font-mono text-sm overflow-hidden"
        >
          {legacyEntry.command && (
            <div className="flex items-center gap-2 text-[#d4d4d4] mb-1 transition-all duration-200 hover:bg-[#2d2d2d] hover:bg-opacity-30 rounded px-1 -mx-1 overflow-hidden">
              <span className="text-[#4ec9b0] transition-transform duration-200 hover:scale-110 flex-shrink-0">➜</span>
              <span className="text-[#569cd6] font-semibold flex-shrink-0">portfolio</span>
              <span className="text-[#d4d4d4] break-all">{legacyEntry.command}</span>
            </div>
          )}
          {legacyEntry.output && (
            <div className="ml-6 whitespace-pre-wrap text-[#d4d4d4] transition-all duration-200 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {legacyEntry.output}
            </div>
          )}
        </motion.div>
      );
    }

    // Handle new TerminalEntry format with enhanced animations
    return (
      <motion.div
        key={entryId}
        initial={isNew ? { opacity: 0, y: 10, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: isNew ? 0.3 : 0, 
          ease: [0.4, 0, 0.2, 1],
          delay: (isNew && isLatest) ? 0 : 0
        }}
        className="font-mono text-sm group"
      >
        {/* Command line (if exists) */}
        {entry.command && (
          <div className="flex items-center gap-2 text-[#d4d4d4] mb-1 transition-all duration-200 hover:bg-[#2d2d2d] hover:bg-opacity-30 rounded px-1 -mx-1 overflow-hidden">
            <span className="text-[#4ec9b0] transition-transform duration-200 group-hover:scale-110 flex-shrink-0">➜</span>
            <span className="text-[#569cd6] font-semibold flex-shrink-0">portfolio</span>
            <span className="text-[#d4d4d4] break-all">{entry.command}</span>
            {/* Requirement 6.1: Display loading indicator */}
            {entry.isLoading && renderLoadingIndicator()}
          </div>
        )}
        
        {/* Output with appropriate styling and animations */}
        {entry.output && (
          <motion.div
            initial={isNew ? { opacity: 0, x: -5 } : { opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: isNew ? 0.2 : 0, delay: isNew ? 0.1 : 0 }}
            className={`flex items-start gap-2 md:ml-6 p-2 rounded transition-all duration-300 hover:bg-[#2d2d2d] hover:bg-opacity-20 overflow-hidden`}
          >
            {/* Requirement 6.4: Display icons based on type */}
            {getOutputIcon(entry.type)}
            
            {/* Requirement 6.2: Display output with appropriate styling */}
            <div 
              className={`whitespace-pre-wrap ${getOutputColor(entry.type)} flex-1 transition-all duration-200 break-words overflow-wrap-anywhere`}
              style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            >
              {entry.output}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div 
      ref={outputRef}
      className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 scroll-smooth transition-all duration-300"
      role="log"
      aria-live="polite"
      aria-label="Terminal output"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#424242 #1e1e1e',
        wordBreak: 'break-word',
        overflowWrap: 'break-word'
      }}
    >
      <AnimatePresence mode="popLayout">
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[#858585] text-sm font-mono"
          >
            No output yet. Type a command to get started.
          </motion.div>
        ) : (
          history.map((entry, index) => renderEntry(entry, index))
        )}
      </AnimatePresence>
      
      {/* Global loading indicator when terminal is processing */}
      {isLoading && history.length > 0 && (
        (() => {
          const lastEntry = history[history.length - 1];
          const isLastEntryLoading = isTerminalEntry(lastEntry) && lastEntry.isLoading;
          
          return !isLastEntryLoading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[#858585] text-sm font-mono p-2 rounded bg-[#2d2d2d] bg-opacity-30"
            >
              <span>Processing</span>
              {renderLoadingIndicator()}
            </motion.div>
          );
        })()
      )}
    </div>
  );
};

export default TerminalOutput;
