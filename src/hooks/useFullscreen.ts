import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing fullscreen state
 * Handles browser compatibility with vendor prefixes
 * Supports ESC key to exit fullscreen
 */
export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check browser support for Fullscreen API
    const checkSupport = () => {
      return !!(
        document.fullscreenEnabled ||
        (document as any).webkitFullscreenEnabled ||
        (document as any).mozFullScreenEnabled ||
        (document as any).msFullscreenEnabled
      );
    };

    setIsSupported(checkSupport());

    // Handle fullscreen change events (including ESC key)
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Add event listeners for all vendor prefixes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Request fullscreen with vendor prefix support
  const requestFullscreen = useCallback(async (element: HTMLElement) => {
    if (element.requestFullscreen) {
      return element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      return (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      return (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      return (element as any).msRequestFullscreen();
    }
    throw new Error('Fullscreen API not supported');
  }, []);

  // Exit fullscreen with vendor prefix support
  const exitFullscreen = useCallback(async () => {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      return (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      return (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      return (document as any).msExitFullscreen();
    }
    throw new Error('Fullscreen API not supported');
  }, []);

  // Toggle fullscreen with error handling
  const toggleFullscreen = useCallback(async () => {
    if (!isSupported) {
      console.warn('Fullscreen API not supported in this browser');
      return;
    }

    try {
      if (!isFullscreen) {
        await requestFullscreen(document.documentElement);
      } else {
        await exitFullscreen();
      }
    } catch (error) {
      // Handle different error types
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          console.error('Fullscreen denied: User interaction required or security restriction');
        } else if (error.name === 'NotSupportedError') {
          console.error('Fullscreen not supported in this browser');
        } else {
          console.error('Fullscreen error:', error.message);
        }
      } else {
        console.error('Unknown fullscreen error:', error);
      }
    }
  }, [isFullscreen, isSupported, requestFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    isSupported,
    toggleFullscreen,
  };
};
