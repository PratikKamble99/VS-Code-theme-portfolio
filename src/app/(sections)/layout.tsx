'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, Taskbar } from '@/components/layout';
import { TerminalPanel } from '@/components/terminal';
import { OnboardingSteps } from '@/components/ui';
import { useFullscreen, useGuideState } from '@/hooks';
import { ThemeProvider, TerminalProvider } from '@/contexts';
import { AnimationProvider } from '@/components/providers';

interface SectionsLayoutProps {
  children: React.ReactNode;
}

/**
 * SectionsLayout - Shared layout for all portfolio sections
 * Provides persistent sidebar, taskbar, and terminal across all sections
 */
export default function SectionsLayout({ children }: SectionsLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Get current section from pathname
  const currentSection = pathname?.split('/')[1] || 'about';

  // Sidebar collapse state for mobile responsiveness
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Terminal visibility state - persist across route changes
  const [isTerminalVisible, setIsTerminalVisible] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('terminal-visible');
      return saved === 'true';
    }
    return true;
  });

  // Terminal minimized state - persist across route changes
  const [isTerminalMinimized, setIsTerminalMinimized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('terminal-minimized');
      return saved === 'true';
    }
    return false;
  });

  // Use guide hook for auto-showing onboarding on first visit
  const { isVisible: isGuideVisible, showGuide, dismissGuide } = useGuideState();

  // Fullscreen state management using custom hook
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Track if component is mounted (for SSR compatibility)
  const [mounted, setMounted] = useState(false);

  // Track mobile state for responsive behavior
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior on mount and resize
  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);

      // Collapse sidebar on mobile devices (< 768px)
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Navigation handler - updates current section using Next.js router
   */
  const handleNavigate = (section: string) => {
    router.push(`/${section}`);

    // Auto-collapse sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setIsSidebarCollapsed(true);
    }
  };

  /**
   * Toggle sidebar visibility (primarily for mobile)
   */
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  /**
   * Toggle terminal visibility
   */
  const toggleTerminal = () => {
    setIsTerminalVisible(prev => {
      const newValue = !prev;
      // Persist terminal state
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('terminal-visible', newValue.toString());
      }
      return newValue;
    });
  };

  /**
   * Handle minimize terminal
   */
  const handleMinimizeTerminal = () => {
    if (isTerminalVisible) {
      setIsTerminalMinimized(prev => {
        const newValue = !prev;
        // Persist minimized state
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('terminal-minimized', newValue.toString());
        }
        return newValue;
      });
    }
  };

  /**
   * Handle close terminal - closes terminal if visible
   */
  const handleCloseTerminal = () => {
    if (isTerminalVisible) {
      setIsTerminalVisible(false);
      // Persist terminal state
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('terminal-visible', 'false');
      }
    }
  };

  /**
   * Handle toggle fullscreen - uses useFullscreen hook
   */
  const handleToggleFullscreen = () => {
    toggleFullscreen();
  };

  // Backtick (`) to toggle terminal and F1 to show guide
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if backtick is pressed without modifiers
      if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        // Check if we're not in an input field (to avoid interfering with typing)
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault(); // Prevent default browser behavior
          toggleTerminal();
        }
      }

      // F1 to show guide
      if (e.key === 'F1') {
        e.preventDefault(); // Prevent default browser help
        showGuide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGuide, toggleTerminal]);

  // Prevent flash of unstyled content during SSR
  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider>
      <TerminalProvider>
        <AnimationProvider>
          <div
            className="flex flex-col h-screen w-full overflow-hidden bg-vscode-bg font-mono"
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace"
            }}
          >
            {/* Taskbar with window controls */}
            <Taskbar
              onClose={handleCloseTerminal}
              onMinimize={handleMinimizeTerminal}
              onFullscreen={handleToggleFullscreen}
              onToggleTerminal={toggleTerminal}
              isTerminalVisible={isTerminalVisible}
              isTerminalMinimized={isTerminalMinimized}
              isFullscreen={isFullscreen}
              userName="Pratik Kamble"
            />

            {/* Main layout container with sidebar and content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Mobile Menu Toggle Button */}
              <motion.button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 md:hidden bg-vscode-bg-secondary border border-vscode-border rounded p-2 text-vscode-text hover:bg-vscode-bg-tertiary transition-colors"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle navigation menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="transition-transform"
                  style={{
                    transform: isSidebarCollapsed ? 'rotate(0deg)' : 'rotate(90deg)'
                  }}
                >
                  {isSidebarCollapsed ? (
                    // Menu icon (hamburger)
                    <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                  ) : (
                    // Close icon (X)
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                  )}
                </svg>
              </motion.button>

              {/* Mobile Overlay - closes sidebar when clicked */}
              {!isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                  aria-hidden="true"
                />
              )}

              {/* Sidebar Navigation */}
              <div className={`
                ${isSidebarCollapsed ? 'hidden md:flex' : 'fixed md:relative'}
                z-40 h-full
              `}>
                <Sidebar
                  currentSection={currentSection}
                  onNavigate={handleNavigate}
                  isCollapsed={false}
                />
              </div>

              {/* Main Content Area with Terminal */}
              <div className="flex-1 flex flex-col relative overflow-hidden">
                <div
                  className="flex-1 transition-all duration-300 ease-in-out overflow-auto"
                  style={{
                    // On desktop, add padding to prevent content from being hidden behind terminal
                    // On mobile, terminal is full-screen overlay so no padding needed
                    paddingBottom: (isTerminalVisible && !isMobile) ? '300px' : '0',
                    backgroundColor: 'var(--color-bg)'
                  }}
                >
                  {children}
                </div>

                {/* Terminal Panel */}
                <TerminalPanel
                  isVisible={isTerminalVisible}
                  onToggle={toggleTerminal}
                  onNavigate={handleNavigate}
                  isMinimized={isTerminalMinimized}
                  onMinimize={handleMinimizeTerminal}
                  showGuide={showGuide}
                />
              </div>
            </div>

            {/* Onboarding Steps */}
            <OnboardingSteps
              isVisible={isGuideVisible}
              onComplete={dismissGuide}
            />
          </div>
        </AnimationProvider>
      </TerminalProvider>
    </ThemeProvider>
  );
}