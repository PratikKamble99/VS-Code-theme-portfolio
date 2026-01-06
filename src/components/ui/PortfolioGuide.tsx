'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioGuideProps {
  isVisible: boolean;
  onClose: () => void;
}

/**
 * PortfolioGuide - Interactive guide overlay for first-time visitors
 * 
 * Features:
 * - Welcome message and introduction
 * - Terminal opening instructions
 * - List of useful automated commands
 * - Keyboard shortcuts reference
 * - Dismissible with close button or Escape key
 * - Responsive layout for mobile devices
 * 
 * Requirements: 1.2, 1.3, 1.4, 2.1, 2.3, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3
 */
export const PortfolioGuide: React.FC<PortfolioGuideProps> = ({ isVisible, onClose }) => {
  
  // Handle Escape key to close guide
  // Requirement 2.3: Dismiss guide with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Semi-transparent overlay - Requirement 4.1 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black bg-opacity-60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Guide content - Requirement 4.5: Centered on screen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              duration: 0.4,
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
              style={{
                backgroundColor: 'var(--color-bgSecondary)',
                borderColor: 'var(--color-border)',
                borderWidth: '1px',
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="guide-title"
            >
              {/* Close button - Requirement 2.1 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: 'var(--color-bgTertiary)',
                  color: 'var(--color-textSecondary)',
                }}
                aria-label="Close guide"
                title="Close (Esc)"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 16 16" 
                  fill="currentColor"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
              </button>

              {/* Content with padding */}
              <div className="p-6 sm:p-8">
                {/* Welcome Section - Requirement 4.2: Clear sections with headings */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    {/* Icon - Requirement 4.3 */}
                    <svg 
                      width="32" 
                      height="32" 
                      viewBox="0 0 16 16" 
                      fill="currentColor"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                    </svg>
                    <h2 
                      id="guide-title"
                      className="text-2xl sm:text-3xl font-bold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Welcome to My Portfolio!
                    </h2>
                  </div>
                  <p 
                    className="text-base sm:text-lg leading-relaxed"
                    style={{ color: 'var(--color-textSecondary)' }}
                  >
                    This is an interactive VS Code-themed portfolio. Here&apos;s how to navigate and explore:
                  </p>
                </div>

                {/* Terminal Section - Requirement 1.2: Instructions for opening terminal */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 16 16" 
                      fill="currentColor"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
                    </svg>
                    <h3 
                      className="text-xl font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Open the Terminal
                    </h3>
                  </div>
                  <div 
                    className="p-4 rounded-lg mb-3"
                    style={{ backgroundColor: 'var(--color-bgTertiary)' }}
                  >
                    <p 
                      className="text-sm sm:text-base mb-2"
                      style={{ color: 'var(--color-textSecondary)' }}
                    >
                      Press the <strong style={{ color: 'var(--color-accent)' }}>backtick key (`)</strong> to toggle the terminal
                    </p>
                    <div 
                      className="inline-block px-3 py-1 rounded font-mono text-sm"
                      style={{ 
                        backgroundColor: 'var(--color-bgSecondary)',
                        color: 'var(--color-accent)',
                        borderWidth: '1px',
                        borderColor: 'var(--color-border)'
                      }}
                    >
                      `
                    </div>
                  </div>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-textMuted)' }}
                  >
                    Or click the floating terminal button in the bottom-right corner
                  </p>
                </div>

                {/* Commands Section - Requirement 1.3: List of automated commands */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 16 16" 
                      fill="currentColor"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                    </svg>
                    <h3 
                      className="text-xl font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Useful Commands
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { cmd: 'help', desc: 'Show all available commands' },
                      { cmd: 'goto <section>', desc: 'Navigate to a section (about, skills, experience, projects, contact)' },
                      { cmd: 'theme <dark|light>', desc: 'Switch between dark and light themes' },
                      { cmd: 'about', desc: 'Display information about me' },
                      { cmd: 'projects', desc: 'List all my projects' },
                      { cmd: 'contact', desc: 'Show contact information' },
                      { cmd: 'clear', desc: 'Clear terminal output' },
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-start gap-2 p-3 rounded"
                        style={{ backgroundColor: 'var(--color-bgTertiary)' }}
                      >
                        <code 
                          className="font-mono text-sm shrink-0"
                          style={{ color: 'var(--color-accent)' }}
                        >
                          {item.cmd}
                        </code>
                        <span 
                          className="text-sm"
                          style={{ color: 'var(--color-textSecondary)' }}
                        >
                          {item.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keyboard Shortcuts Section - Requirement 1.4 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 16 16" 
                      fill="currentColor"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      <path d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z"/>
                      <path d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm0-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5 0A.25.25 0 0 1 8.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 8 8.75v-.5zm2 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-.5zm1 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5-2A.25.25 0 0 1 6.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 6 8.75v-.5zm-2 0A.25.25 0 0 1 4.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 4 8.75v-.5zm-2 0A.25.25 0 0 1 2.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 8.75v-.5zm11-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0A.25.25 0 0 1 9.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 9 6.75v-.5zm-2 0A.25.25 0 0 1 7.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 7 6.75v-.5zm-2 0A.25.25 0 0 1 5.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 5 6.75v-.5zm-3 0A.25.25 0 0 1 2.25 6h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5A.25.25 0 0 1 2 6.75v-.5zm0 4a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm2 0a.25.25 0 0 1 .25-.25h5.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-5.5a.25.25 0 0 1-.25-.25v-.5z"/>
                    </svg>
                    <h3 
                      className="text-xl font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Keyboard Shortcuts
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { keys: '`', desc: 'Toggle terminal' },
                      { keys: 'Esc', desc: 'Close terminal/guide' },
                      { keys: '↑ / ↓', desc: 'Navigate command history' },
                      { keys: 'Ctrl+L', desc: 'Clear terminal' },
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-2 rounded"
                        style={{ backgroundColor: 'var(--color-bgTertiary)' }}
                      >
                        <kbd 
                          className="px-2 py-1 rounded text-xs font-mono"
                          style={{ 
                            backgroundColor: 'var(--color-bgSecondary)',
                            color: 'var(--color-accent)',
                            borderWidth: '1px',
                            borderColor: 'var(--color-border)'
                          }}
                        >
                          {item.keys}
                        </kbd>
                        <span 
                          className="text-sm"
                          style={{ color: 'var(--color-textSecondary)' }}
                        >
                          {item.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer tip */}
                <div 
                  className="text-center text-sm p-3 rounded"
                  style={{ 
                    backgroundColor: 'var(--color-bgTertiary)',
                    color: 'var(--color-textMuted)'
                  }}
                >
                  💡 Type <code style={{ color: 'var(--color-accent)' }}>guide</code> in the terminal anytime to see this again
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PortfolioGuide;
