'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionTabProps {
  section: string;                 // Section identifier (e.g., 'about', 'projects')
  label: string;                   // Display label for the tab
  isActive: boolean;               // Whether this tab is currently active
  onClick: () => void;             // Click handler
  onClose?: () => void;            // Close/delete handler
  showClose?: boolean;             // Whether to show close button
  className?: string;              // Optional additional CSS classes
}

/**
 * SectionTab - Individual tab representing a single section
 * 
 * Displays a clickable tab with:
 * - Section label
 * - Active state visual distinction
 * - Hover effects
 * - Smooth animations
 * 
 * Requirements: 1.3, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.4
 */
export const SectionTab: React.FC<SectionTabProps> = React.memo(({ 
  section, 
  label, 
  isActive, 
  onClick, 
  onClose,
  showClose = true,
  className = '' 
}) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tab click when closing
    onClose?.();
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative px-4 py-2 text-sm font-medium
        transition-all duration-200 ease-out
        border-r
        min-w-[120px] sm:min-w-[100px]
        min-h-[44px]
        flex items-center justify-center gap-2
        ${className}
      `}
      style={{
        backgroundColor: isActive ? 'var(--color-bgTertiary)' : 'var(--color-bgSecondary)',
        color: isActive ? 'var(--color-accent)' : 'var(--color-textSecondary)',
        borderColor: 'var(--color-border)',
        borderBottomWidth: isActive ? '2px' : '0px',
        borderBottomColor: isActive ? 'var(--color-accent)' : 'transparent',
      }}
      whileHover={{
        backgroundColor: isActive ? undefined : 'var(--color-bgTertiary)',
        color: isActive ? undefined : 'var(--color-text)',
      }}
      whileTap={{ scale: 0.98 }}
      aria-label={`Navigate to ${label} section`}
      aria-current={isActive ? 'page' : undefined}
      role="tab"
      aria-selected={isActive}
      tabIndex={0}
    >
      {/* Tab label */}
      <span className="truncate flex-1">
        {label}
      </span>

      {/* Close button */}
      {onClose && showClose && (
        <motion.button
          onClick={handleClose}
          className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-opacity-20"
          style={{
            color: isActive ? 'var(--color-accent)' : 'var(--color-textMuted)',
          }}
          whileHover={{ 
            scale: 1.2,
            backgroundColor: 'var(--color-error)',
            color: 'var(--color-bg)',
          }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Close ${label} tab`}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
          </svg>
        </motion.button>
      )}

      {/* Active indicator dot */}
      {isActive && (
        <motion.div
          className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: 'var(--color-accent)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
});

SectionTab.displayName = 'SectionTab';

export default SectionTab;
