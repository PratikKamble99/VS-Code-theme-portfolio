'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavigationItem } from '@/types';
import { useAnimationConfig } from '@/components/providers';

interface SidebarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  isCollapsed?: boolean;
  className?: string;
}

// Navigation items for portfolio sections
const navigationItems: NavigationItem[] = [
  {
    id: 'about',
    label: 'About.tsx',
    icon: 'user',
    section: 'about'
  },
  {
    id: 'skills',
    label: 'Skills.tsx',
    icon: 'code',
    section: 'skills'
  },
  {
    id: 'experience',
    label: 'Experience.tsx',
    icon: 'briefcase',
    section: 'experience'
  },
  {
    id: 'projects',
    label: 'Projects.tsx',
    icon: 'folder',
    section: 'projects'
  },
  {
    id: 'contact',
    label: 'Contact.tsx',
    icon: 'mail',
    section: 'contact'
  }
];

/**
 * Sidebar navigation component with VS Code styling
 * Implements active section highlighting, hover effects, and mobile collapsible menu
 * 
 * Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 5.4, 6.1
 */
export default function Sidebar({ currentSection, onNavigate, isCollapsed = false, className = '' }: SidebarProps) {
  const { variants, reducedMotion } = useAnimationConfig();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Get icon SVG based on icon name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'user':
        return (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
          </svg>
        );
      case 'code':
        return (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
          </svg>
        );
      case 'briefcase':
        return (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z"/>
          </svg>
        );
      case 'folder':
        return (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M.54 3.87L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19z"/>
          </svg>
        );
      case 'mail':
        return (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          </svg>
        );
    }
  };

  return (
    <motion.div
      className={`border-r flex flex-col ${className} h-full`}
      style={{
        backgroundColor: 'var(--color-bgSecondary)',
        borderColor: 'var(--color-border)'
      }}
      initial={false}
      animate={{
        width: isCollapsed ? 0 : '250px',
        opacity: isCollapsed ? 0 : 1,
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.2,
        ease: [0.4, 0.0, 0.2, 1]
      }}
    >
      {/* Sidebar Header */}
      {/* <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
            Portfolio
          </span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-error)' }}></div>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-warning)' }}></div>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-success)' }}></div>
          </div>
        </div>
      </div> */}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-2" data-tour="sidebar-nav">
        {navigationItems.map((item, index) => {
          const isActive = currentSection === item.section;
          const isHovered = hoveredItem === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.section)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left
                transition-all duration-200 ease-out
                relative group
                ${isActive 
                  ? 'bg-opacity-20' 
                  : ''
                }
              `}
              style={{
                backgroundColor: isActive ? 'var(--color-bgTertiary)' : 'transparent',
                color: isActive ? 'var(--color-accent)' : 'var(--color-textSecondary)'
              }}
              whileHover={reducedMotion ? {} : { x: 4 }}
              whileTap={reducedMotion ? {} : { scale: 0.98 }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                  layoutId="activeIndicator"
                  transition={{
                    type: reducedMotion ? 'tween' : 'spring',
                    stiffness: 300,
                    damping: 30
                  }}
                />
              )}

              {/* Icon */}
                <motion.div
                  className={`flex-shrink-0`}
                  style={{ color: isActive ? 'var(--color-accent)' : undefined }}
                  animate={{
                    scale: isHovered && !reducedMotion ? 1.1 : 1,
                    rotate: isHovered && !reducedMotion ? [0, -5, 5, 0] : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {getIcon(item.icon)}
                </motion.div>

                {/* Label */}
                <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>

                {/* Hover indicator */}
                {isHovered && !isActive && (
                  <motion.div
                    className="absolute right-2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            );
          })}
      </nav>

      {/* Sidebar Footer */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-textMuted)' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z"/>
            <path d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H6a.5.5 0 0 1 0-1h1.5V4a.5.5 0 0 1 .5-.5z"/>
          </svg>
          <span>Ready</span>
        </div>
      </div>
    </motion.div>
  );
}