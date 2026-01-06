import React from 'react';

interface WindowControlsProps {
  onClose: () => void;
  onMinimize: () => void;
  onFullscreen: () => void;
  isTerminalVisible: boolean;
  isTerminalMinimized: boolean;
  isFullscreen: boolean;
  className?: string;
}

export const WindowControls: React.FC<WindowControlsProps> = ({
  onClose,
  onMinimize,
  onFullscreen,
  isTerminalVisible,
  isTerminalMinimized,
  isFullscreen,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Red button - Close terminal */}
      <button
        // onClick={onClose}
        disabled={true}
        className="group relative w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Close terminal"
        title="Close"
      >
        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/70 transition-opacity duration-200">
          ×
        </span>
      </button>

      {/* Yellow button - Minimize terminal */}
      <button
        // onClick={onMinimize}
        disabled={true}
        className="group relative w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ff9500] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Minimize terminal"
        title="Minimize"
      >
        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/70 transition-opacity duration-200">
          −
        </span>
      </button>

      {/* Green button - Toggle fullscreen */}
      <button
        onClick={onFullscreen}
        className="group relative w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#28cd41] transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Toggle fullscreen"
        title="Fullscreen"
      >
        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/70 transition-opacity duration-200">
          {isFullscreen ? '⤡' : '⤢'}
        </span>
      </button>
    </div>
  );
};
