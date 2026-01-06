'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WindowControls } from './WindowControls';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks';

interface TaskbarProps {
  onClose: () => void;           // Handler for red dot (close terminal)
  onMinimize: () => void;        // Handler for yellow dot (minimize terminal)
  onFullscreen: () => void;      // Handler for green dot (toggle fullscreen)
  isTerminalVisible: boolean;    // Terminal visibility state
  isTerminalMinimized: boolean;  // Terminal minimized state
  isFullscreen: boolean;         // Fullscreen mode state
  userName: string;              // User's name to display
  onToggleTerminal?: () => void; // Handler for terminal toggle button
  className?: string;            // Optional additional classes
}

/**
 * Taskbar Component - Mac-style taskbar with window controls and user name
 * 
 * Features:
 * - Flexbox layout with left, center, and right sections
 * - Theme-aware styling using CSS variables
 * - Responsive behavior with mobile simplification
 * - Displays user name in center section
 * - Hides window controls and terminal toggle on mobile
 * 
 * Requirements: 1.1, 1.4, 2.1, 2.2, 2.3, 6.1, 6.2, 6.3, 4.1
 */
export const Taskbar: React.FC<TaskbarProps> = ({
  onClose,
  onMinimize,
  onFullscreen,
  isTerminalVisible,
  isTerminalMinimized,
  isFullscreen,
  userName,
  onToggleTerminal,
  className = ''
}) => {
  const { themeName, toggleTheme } = useTheme();
  const { isMobile } = useResponsive();

  return (
    <div 
      className={`taskbar ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'space-between',
        height: isMobile ? '36px' : '44px',
        padding: isMobile ? '0 12px' : '0 16px',
        backgroundColor: 'var(--color-bgSecondary)',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Left section - Window controls (hidden on mobile) */}
      {!isMobile && (
        <div 
          className="taskbar-left"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '80px'
          }}
        >
          <WindowControls
            onClose={onClose}
            onMinimize={onMinimize}
            onFullscreen={onFullscreen}
            isTerminalVisible={isTerminalVisible}
            isTerminalMinimized={isTerminalMinimized}
            isFullscreen={isFullscreen}
          />
        </div>
      )}

      {/* Center section - User name */}
      <div 
        className="taskbar-center"
        style={{
          position: isMobile ? 'static' : 'absolute',
          left: isMobile ? 'auto' : '50%',
          transform: isMobile ? 'none' : 'translateX(-50%)',
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: 600,
          color: 'var(--color-text)',
          transition: 'all 0.2s ease',
          letterSpacing: '0.5px'
        }}
      >
        {userName}
      </div>

      {/* Right section - Terminal toggle (hidden on mobile) */}
      {!isMobile && (
        <div 
          className="taskbar-right"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '80px',
            justifyContent: 'flex-end'
          }}
        >
          {/* Terminal Toggle Button */}
          {onToggleTerminal && (
            <motion.button
              onClick={onToggleTerminal}
              className="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 hover:bg-[var(--color-bgTertiary)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle terminal"
              title="Toggle Terminal (`)"
              data-tour="terminal-button-taskbar"
              style={{
                color: isTerminalVisible ? 'var(--color-accent)' : 'var(--color-textSecondary)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
              </svg>
            </motion.button>
          )}

          {/* Theme Toggle Button */}
          {/* <motion.button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 hover:bg-[var(--color-bgTertiary)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${themeName === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${themeName === 'dark' ? 'light' : 'dark'} theme`}
            style={{
              color: 'var(--color-accent)'
            }}
          >
            {themeName === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </motion.button> */}
        </div>
      )}
    </div>
  );
};

export default Taskbar;
