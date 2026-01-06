'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingTerminalButtonProps {
  isVisible: boolean;           // Show only on mobile
  isTerminalOpen: boolean;      // Terminal state for icon styling
  onClick: () => void;          // Toggle terminal
}

/**
 * FloatingTerminalButton - Floating action button for terminal toggle on mobile
 * 
 * Features:
 * - Fixed positioning at bottom-left corner
 * - Material Design FAB size (56x56px)
 * - Animated entrance and interactions
 * - VS Code accent color styling
 * - Touch-friendly size
 * 
 * Requirements: 4.2, 4.3
 */
export const FloatingTerminalButton: React.FC<FloatingTerminalButtonProps> = ({
  isVisible,
  isTerminalOpen,
  onClick,
}) => {
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <motion.button
      onClick={onClick}
      className="fab"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      style={{
        backgroundColor: isTerminalOpen ? 'var(--color-accent)' : 'var(--color-bgSecondary)',
        color: isTerminalOpen ? 'var(--color-bg)' : 'var(--color-accent)',
        border: `2px solid ${isTerminalOpen ? 'var(--color-accent)' : 'var(--color-border)'}`,
      }}
      aria-label={isTerminalOpen ? 'Close terminal' : 'Open terminal'}
      title={isTerminalOpen ? 'Close Terminal' : 'Open Terminal'}
    >
      {/* Terminal Icon */}
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 16 16"
        fill="currentColor"
        animate={{
          rotate: isTerminalOpen ? 180 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z" />
      </motion.svg>

      {/* Pulse animation when terminal has updates (optional enhancement) */}
      {!isTerminalOpen && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: 'var(--color-accent)',
            opacity: 0.3,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.button>
  );
};

export default FloatingTerminalButton;
