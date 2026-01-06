'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TerminalPanelProps } from '@/types/terminal';
import { terminalConfig } from '@/config';
import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';
import { useTerminal } from '@/contexts';

/**
 * TerminalPanel - Collapsible terminal interface at the bottom of the screen
 * 
 * Features:
 * - Collapsible panel with smooth animations
 * - Terminal header with controls
 * - Command input and output display
 * - Keyboard shortcuts support
 * - Responsive design with mobile overlay mode
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 5.4
 */
export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  isVisible,
  onToggle,
  onNavigate,
  isMinimized = false,
  onMinimize,
  className = '',
  showGuide,
}) => {
  // Use terminal context instead of local state
  const {
    history,
    commandHistory,
    isLoading,
    height,
    isInitialized,
    restoredHistoryCount,
    setHeight,
    handleClear,
    handleCommandSubmit,
    executor
  } = useTerminal();

  const [isMobile, setIsMobile] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Requirement 5.4: Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle command submission
  const handleCommandSubmitLocal = async (command: string) => {
    await handleCommandSubmit(command, onNavigate, showGuide);
  };

  // Handle minimize toggle
  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    }
  };

  // Requirement 10.1, 10.2, 10.3, 10.4, 10.5: Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when terminal is visible
      if (!isVisible) return;

      // Check if we're in an input field (to avoid interfering with typing)
      const target = e.target as HTMLElement;
      const isInInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // Requirement 10.3: Escape to close terminal
      if (e.key === 'Escape') {
        // Don't prevent default if we're in input (let input handle it first)
        if (!isInInput) {
          e.preventDefault();
          onToggle();
        }
      }

      // Requirement 10.2: Ctrl+L to clear terminal
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault(); // Prevent default browser behavior
        handleClear();
      }
    };

    // Requirement 10.5: Add event listener with proper cleanup
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onToggle, handleClear]);

  // Requirement 6.5: Handle terminal resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current) return;
      
      // Calculate new height based on mouse position from bottom
      const viewportHeight = window.innerHeight;
      const newHeight = viewportHeight - e.clientY;
      
      // Constrain height between min and max
      const minHeight = 150;
      const maxHeight = viewportHeight * 0.8;
      const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
      
      setHeight(constrainedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  };

  if (!isVisible) return null;

  // Requirement 5.4: Mobile overlay mode - full screen on small screens
  const mobileOverlayClass = isMobile ? 'inset-0 h-screen' : 'bottom-0 left-0 right-0';
  const mobileHeightStyle = isMobile 
    ? { height: isMinimized ? '48px' : '100vh' }
    : { height: isMinimized ? '48px' : `${height}px` };

  return (
    <>
      {/* Requirement 5.4: Mobile overlay backdrop */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <div
        ref={panelRef}
        className={`${isMobile ? 'fixed' : 'absolute'} ${mobileOverlayClass} ${isMobile ? 'z-50' : 'z-10'} border-t shadow-2xl ${className}`}
        style={{
          fontFamily: "'JetBrains Mono', 'Coolas', 'Monaco', monospace",
          backgroundColor: 'var(--color-bg)',
          borderColor: 'var(--color-border)',
          ...mobileHeightStyle,
        }}
      >
        {/* Requirement 6.5: Enhanced Resize Handle - Only show on desktop when not minimized */}
        {!isMobile && !isMinimized && (
          <motion.div
            onMouseDown={handleResizeStart}
            className={`
              absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize z-50
              transition-all duration-200
              ${isResizing ? 'bg-[#007acc] h-2' : 'bg-transparent hover:bg-[#007acc] hover:h-2'}
              group
            `}
            title="Drag to resize terminal"
            aria-label="Resize terminal"
            whileHover={{ scale: 1.02 }}
            animate={{
              backgroundColor: isResizing ? '#007acc' : 'transparent'
            }}
          >
            {/* Enhanced visual indicator with animation */}
            <motion.div 
              className={`
                absolute top-0 left-1/2 transform -translate-x-1/2 
                w-16 h-1 rounded-b transition-all duration-200
                ${isResizing ? 'bg-[#007acc] shadow-[0_0_10px_rgba(0,122,204,0.5)]' : 'bg-[#3e3e3e] group-hover:bg-[#007acc] group-hover:shadow-[0_0_10px_rgba(0,122,204,0.5)]'}
              `}
              animate={{
                width: isResizing ? '80px' : '64px',
                height: isResizing ? '6px' : '4px'
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Grip dots for better visual feedback */}
              <div className="absolute inset-0 flex items-center justify-center gap-1">
                <span className={`w-1 h-1 rounded-full transition-all duration-200 ${isResizing ? 'bg-white' : 'bg-[#858585] group-hover:bg-white'}`}></span>
                <span className={`w-1 h-1 rounded-full transition-all duration-200 ${isResizing ? 'bg-white' : 'bg-[#858585] group-hover:bg-white'}`}></span>
                <span className={`w-1 h-1 rounded-full transition-all duration-200 ${isResizing ? 'bg-white' : 'bg-[#858585] group-hover:bg-white'}`}></span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Terminal Header */}
        <div 
          className="flex items-center justify-between px-4 py-2 border-b transition-all duration-200"
          style={{
            backgroundColor: 'var(--color-bgSecondary)',
            borderColor: 'var(--color-border)'
          }}
        >
          <div className="flex items-center gap-3">
            {/* Terminal Icon */}
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="currentColor"
              className="transition-colors duration-200"
              style={{ color: 'var(--color-success)' }}
            >
              <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
            </svg>
            
            <span className="text-sm font-semibold transition-colors duration-200" style={{ color: 'var(--color-text)' }}>
              Terminal
            </span>
            
            {/* Status Indicator - Requirement 6.1: Visual feedback */}
            <div className="flex items-center gap-1.5">
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isLoading 
                    ? 'animate-pulse' 
                    : ''
                }`}
                style={{
                  backgroundColor: isLoading ? 'var(--color-warning)' : 'var(--color-success)'
                }}
              ></div>
              <span 
                className="text-xs hidden sm:inline transition-colors duration-200"
                style={{ color: 'var(--color-textSecondary)' }}
              >
                {isLoading ? 'Processing...' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Terminal Controls - Requirement 5.4: Touch-friendly controls */}
          <div className="flex items-center gap-2">
            {/* Clear Button - Requirement 6.2: Visual feedback */}
            <button
              onClick={handleClear}
              className={`${isMobile ? 'p-2.5' : 'p-1.5'} rounded transition-all duration-200 touch-manipulation transform hover:scale-110 active:scale-95 hover:bg-[var(--color-bgTertiary)]`}
              title="Clear terminal (Ctrl+L)"
              aria-label="Clear terminal"
            >
              <svg 
                width={isMobile ? 16 : 14}
                height={isMobile ? 16 : 14}
                viewBox="0 0 16 16" 
                fill="currentColor"
                className="transition-colors duration-200"
                style={{ color: 'var(--color-textSecondary)' }}
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>

            {/* Minimize Button - Hide on mobile when in full-screen mode */}
            {!isMobile && (
              <button
                onClick={handleMinimize}
                className="p-1.5 rounded transition-all duration-200 touch-manipulation transform hover:scale-110 active:scale-95 hover:bg-[var(--color-bgTertiary)]"
                title={isMinimized ? 'Maximize' : 'Minimize'}
                aria-label={isMinimized ? 'Maximize terminal' : 'Minimize terminal'}
              >
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 16 16" 
                  fill="currentColor"
                  className="transition-colors duration-200"
                  style={{ color: 'var(--color-textSecondary)' }}
                >
                  {isMinimized ? (
                    <path d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646 2.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 4.207V11.5a.5.5 0 0 1-1 0V4.207L6.354 5.354a.5.5 0 1 1-.708-.708l2-2z"/>
                  ) : (
                    <path d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707l-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z"/>
                  )}
                </svg>
              </button>
            )}

            {/* Close Button - Requirement 5.4: Larger touch target on mobile */}
            <button
              onClick={onToggle}
              className={`${isMobile ? 'p-2.5' : 'p-1.5'} rounded transition-all duration-200 touch-manipulation transform hover:scale-110 active:scale-95 hover:bg-[var(--color-bgTertiary)]`}
              title="Close terminal (Esc)"
              aria-label="Close terminal"
            >
              <svg 
                width={isMobile ? 16 : 14}
                height={isMobile ? 16 : 14}
                viewBox="0 0 16 16" 
                fill="currentColor"
                className="transition-colors duration-200"
                style={{ color: 'var(--color-textSecondary)' }}
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        {!isMinimized && (
          <div 
            className="flex flex-col"
            style={{ height: isMobile ? 'calc(100vh - 48px)' : `${height - 48}px` }}
          >
            {/* Terminal Output Area */}
            <TerminalOutput 
              history={history}
              isLoading={isLoading}
              restoredHistoryCount={restoredHistoryCount}
            />

            {/* Terminal Input Area - Requirement 5.4: Adjust padding for mobile */}
            <div 
              className={`border-t ${isMobile ? 'p-3' : 'p-4'}`}
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg)'
              }}
            >
              <TerminalInput
                onSubmit={handleCommandSubmitLocal}
                commandHistory={commandHistory}
                disabled={isLoading}
                placeholder="Type 'help' for available commands..."
                onGetSuggestions={(partial) => executor.getCommandSuggestions(partial)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TerminalPanel;
