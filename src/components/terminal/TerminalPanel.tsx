'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TerminalPanelProps } from '@/types/terminal';
import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';
import { useTerminal } from '@/contexts';
import { useResponsive } from '@/hooks';

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  isVisible,
  onToggle,
  onNavigate,
  isMinimized = false,
  onMinimize,
  className = '',
  showGuide,
}) => {
  const {
    history,
    commandHistory,
    isLoading,
    height,
    restoredHistoryCount,
    setHeight,
    handleClear,
    handleCommandSubmit,
    executor,
  } = useTerminal();

  const { isMobile, isTablet, isDesktop } = useResponsive();

  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const showResizeHandle = isTablet || isDesktop;

  /* ---------------------------------------------
     Handle resize start (Pointer Events)
  ---------------------------------------------- */
  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();

    setIsResizing(true);

    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';

    // 🔥 Critical for iPad
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  /* ---------------------------------------------
     Resize logic (Pointer move / up)
  ---------------------------------------------- */
  useEffect(() => {
    if (!isResizing) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!panelRef.current) return;

      const viewportHeight = window.innerHeight;
      const newHeight = viewportHeight - e.clientY;

      const minHeight = 150;
      const maxHeight = viewportHeight * 0.8;

      setHeight(
        Math.max(minHeight, Math.min(maxHeight, newHeight))
      );
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isResizing, setHeight]);

  /* ---------------------------------------------
     Keyboard shortcuts
  ---------------------------------------------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onToggle();
      }

      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onToggle, handleClear]);

  if (!isVisible) return null;

  const mobileOverlayClass = isMobile
    ? 'inset-0 h-screen'
    : 'bottom-0 left-0 right-0';

  const heightStyle = isMobile
    ? { height: isMinimized ? '48px' : '100vh' }
    : { height: isMinimized ? '48px' : `${height}px` };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}

      <div
        ref={panelRef}
        className={`${isMobile ? 'fixed' : 'absolute'} ${mobileOverlayClass} ${
          isMobile ? 'z-50' : 'z-10'
        } border-t shadow-2xl ${className}`}
        style={{
          backgroundColor: 'var(--color-bg)',
          borderColor: 'var(--color-border)',
          fontFamily: "'JetBrains Mono', monospace",
          ...heightStyle,
        }}
      >
        {/* 🔥 Resize Handle */}
        {showResizeHandle && !isMinimized && (
          <motion.div
            onPointerDown={handleResizeStart}
            className={`
              absolute top-0 left-0 right-0 z-50
              h-3 md:h-2
              cursor-ns-resize
              touch-none select-none
              transition-all
              ${isResizing ? 'bg-[#007acc]' : 'bg-transparent hover:bg-[#007acc]'}
            `}
            style={{ touchAction: 'none' }} // 🔥 iPad fix
            title="Drag to resize terminal"
          >
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex gap-1">
              <span className="w-1 h-1 bg-white rounded-full" />
              <span className="w-1 h-1 bg-white rounded-full" />
              <span className="w-1 h-1 bg-white rounded-full" />
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2 border-b"
          style={{
            backgroundColor: 'var(--color-bgSecondary)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-sm font-semibold">Terminal</span>

          <div className="flex items-center gap-2">
            <button onClick={handleClear}>Clear</button>

            {showResizeHandle && (
              <button onClick={onMinimize}>
                {isMinimized ? 'Max' : 'Min'}
              </button>
            )}

            <button onClick={onToggle}>Close</button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div
            className="flex flex-col"
            style={{
              height: isMobile
                ? 'calc(100vh - 48px)'
                : `${height - 48}px`,
            }}
          >
            <TerminalOutput
              history={history}
              isLoading={isLoading}
              restoredHistoryCount={restoredHistoryCount}
            />

            <div className="border-t p-4">
              <TerminalInput
                onSubmit={(cmd) =>
                  handleCommandSubmit(cmd, onNavigate, showGuide)
                }
                commandHistory={commandHistory}
                disabled={isLoading}
                onGetSuggestions={(p) =>
                  executor.getCommandSuggestions(p)
                }
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TerminalPanel;
