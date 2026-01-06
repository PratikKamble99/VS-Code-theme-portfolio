import { useState, useEffect, useCallback } from 'react';

/**
 * Responsive breakpoints matching Tailwind CSS defaults
 */
export const BREAKPOINTS = {
  mobile: 640,    // < 640px
  tablet: 1024,   // 640px - 1024px
  desktop: 1025,  // > 1024px
} as const;

/**
 * Viewport state interface
 */
export interface ResponsiveState {
  isMobile: boolean;      // < 640px
  isTablet: boolean;      // 640px - 1024px
  isDesktop: boolean;     // > 1024px
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

/**
 * Custom hook for responsive viewport detection
 * 
 * Features:
 * - Detects viewport dimensions and breakpoints
 * - Debounces resize events for performance (150ms)
 * - Handles SSR compatibility
 * - Tracks device orientation
 * 
 * Requirements: 1.1, 2.1
 */
export function useResponsive(): ResponsiveState {
  // Initialize with default desktop values for SSR
  const [state, setState] = useState<ResponsiveState>(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 1920,
        height: 1080,
        orientation: 'landscape',
      };
    }

    // Get initial viewport dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      isMobile: width < BREAKPOINTS.mobile,
      isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop,
      isDesktop: width >= BREAKPOINTS.desktop,
      width,
      height,
      orientation: width > height ? 'landscape' : 'portrait',
    };
  });

  /**
   * Calculate responsive state from dimensions
   */
  const calculateState = useCallback((width: number, height: number): ResponsiveState => {
    return {
      isMobile: width < BREAKPOINTS.mobile,
      isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop,
      isDesktop: width >= BREAKPOINTS.desktop,
      width,
      height,
      orientation: width > height ? 'landscape' : 'portrait',
    };
  }, []);

  useEffect(() => {
    // Skip if window is not available (SSR)
    if (typeof window === 'undefined') {
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;

    /**
     * Handle window resize with debouncing
     * Debounce delay: 150ms for optimal performance
     */
    const handleResize = () => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Debounce resize events
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const newState = calculateState(width, height);

        // Only update if state actually changed
        setState((prevState) => {
          if (
            prevState.isMobile !== newState.isMobile ||
            prevState.isTablet !== newState.isTablet ||
            prevState.isDesktop !== newState.isDesktop ||
            prevState.width !== newState.width ||
            prevState.height !== newState.height ||
            prevState.orientation !== newState.orientation
          ) {
            return newState;
          }
          return prevState;
        });
      }, 150);
    };

    /**
     * Handle orientation change
     * Force immediate update on orientation change
     */
    const handleOrientationChange = () => {
      // Clear any pending resize timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Immediate update for orientation change
      const width = window.innerWidth;
      const height = window.innerHeight;
      setState(calculateState(width, height));
    };

    // Set initial state on mount
    const width = window.innerWidth;
    const height = window.innerHeight;
    setState(calculateState(width, height));

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Cleanup event listeners and timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [calculateState]);

  return state;
}

/**
 * Helper function to get breakpoint name from width
 */
export function getBreakpoint(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (width < BREAKPOINTS.mobile) {
    return 'mobile';
  } else if (width < BREAKPOINTS.desktop) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Helper function to detect touch device
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}
