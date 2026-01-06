'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionTab } from './SectionTab';

interface SectionTabBarProps {
  visitedSections: string[];      // Array of section IDs that have been visited
  activeSection: string;           // Currently active section ID
  onTabClick: (section: string) => void;  // Handler for tab click navigation
  onTabClose?: (section: string) => void; // Handler for tab close
  className?: string;              // Optional additional CSS classes
}

// Section display configuration
const SECTION_CONFIGS: Record<string, { id: string; label: string }> = {
  about: { id: 'about', label: 'About' },
  skills: { id: 'skills', label: 'Skills' },
  experience: { id: 'experience', label: 'Experience' },
  projects: { id: 'projects', label: 'Projects' },
  contact: { id: 'contact', label: 'Contact' }
};

/**
 * SectionTabBar - Container component for section tabs
 * 
 * Displays a horizontal tab bar showing visited sections with:
 * - Clickable tabs for navigation
 * - Active tab highlighting
 * - Horizontal scrolling for overflow
 * - Responsive layout
 * - Terminal theme styling
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.3, 5.1, 5.2, 5.4
 */
export const SectionTabBar: React.FC<SectionTabBarProps> = ({ 
  visitedSections, 
  activeSection, 
  onTabClick,
  onTabClose,
  className = '' 
}) => {
  // Ref for the tab bar container
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Do not render if no sections visited (Edge Case 1)
  if (visitedSections.length === 0) {
    return null;
  }

  /**
   * Handle keyboard navigation with arrow keys
   * Requirement 4.4: Keyboard navigation support
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const currentIndex = visitedSections.indexOf(activeSection);
    
    if (event.key === 'ArrowLeft' && currentIndex > 0) {
      // Navigate to previous tab
      event.preventDefault();
      onTabClick(visitedSections[currentIndex - 1]);
    } else if (event.key === 'ArrowRight' && currentIndex < visitedSections.length - 1) {
      // Navigate to next tab
      event.preventDefault();
      onTabClick(visitedSections[currentIndex + 1]);
    } else if (event.key === 'Home') {
      // Navigate to first tab
      event.preventDefault();
      onTabClick(visitedSections[0]);
    } else if (event.key === 'End') {
      // Navigate to last tab
      event.preventDefault();
      onTabClick(visitedSections[visitedSections.length - 1]);
    }
  }, [visitedSections, activeSection, onTabClick]);

  return (
    <motion.div
      ref={tabBarRef}
      className={`
        w-full border-t
        overflow-x-auto overflow-y-hidden
        ${className}
      `}
      style={{
        backgroundColor: 'var(--color-bgSecondary)',
        borderColor: 'var(--color-border)',
        // Custom scrollbar styling for better terminal theme integration
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--color-border) transparent',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      role="tablist"
      aria-label="Section navigation tabs"
      onKeyDown={handleKeyDown}
    >
      <div className="flex min-w-min">
        <AnimatePresence mode="popLayout">
          {visitedSections.map((sectionId) => {
            const config = SECTION_CONFIGS[sectionId];
            
            // Skip invalid sections
            if (!config) {
              console.warn(`Invalid section ID: ${sectionId}`);
              return null;
            }

            return (
              <motion.div
                key={sectionId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <SectionTab
                  section={config.id}
                  label={config.label}
                  isActive={activeSection === sectionId}
                  onClick={() => onTabClick(sectionId)}
                  onClose={onTabClose ? () => onTabClose(sectionId) : undefined}
                  showClose={visitedSections.length > 1}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SectionTabBar;
