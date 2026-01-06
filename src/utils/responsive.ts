/**
 * Responsive utility functions
 * 
 * Provides helper functions for responsive behavior and viewport detection
 * Requirements: 1.1, 1.3
 */

/**
 * Responsive breakpoints matching Tailwind CSS defaults
 */
export const RESPONSIVE_BREAKPOINTS = {
  mobile: 640,    // < 640px
  tablet: 1024,   // 640px - 1024px
  desktop: 1025,  // > 1024px
} as const;

/**
 * Get the current breakpoint name based on viewport width
 * 
 * @param width - Viewport width in pixels
 * @returns Breakpoint name: 'mobile', 'tablet', or 'desktop'
 */
export function getBreakpoint(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (width < RESPONSIVE_BREAKPOINTS.mobile) {
    return 'mobile';
  } else if (width < RESPONSIVE_BREAKPOINTS.desktop) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Check if the current device supports touch events
 * 
 * @returns true if touch is supported, false otherwise
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

/**
 * Check if viewport is mobile size
 * 
 * @param width - Viewport width in pixels
 * @returns true if mobile viewport
 */
export function isMobileViewport(width: number): boolean {
  return width < RESPONSIVE_BREAKPOINTS.mobile;
}

/**
 * Check if viewport is tablet size
 * 
 * @param width - Viewport width in pixels
 * @returns true if tablet viewport
 */
export function isTabletViewport(width: number): boolean {
  return width >= RESPONSIVE_BREAKPOINTS.mobile && width < RESPONSIVE_BREAKPOINTS.desktop;
}

/**
 * Check if viewport is desktop size
 * 
 * @param width - Viewport width in pixels
 * @returns true if desktop viewport
 */
export function isDesktopViewport(width: number): boolean {
  return width >= RESPONSIVE_BREAKPOINTS.desktop;
}

/**
 * Get viewport dimensions
 * Returns default values for SSR
 * 
 * @returns Object with width and height
 */
export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 1920, height: 1080 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Check if device is in portrait orientation
 * 
 * @returns true if portrait, false if landscape
 */
export function isPortrait(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.innerHeight > window.innerWidth;
}

/**
 * Check if device is in landscape orientation
 * 
 * @returns true if landscape, false if portrait
 */
export function isLandscape(): boolean {
  return !isPortrait();
}

/**
 * Debounce function for performance optimization
 * Useful for resize event handlers
 * 
 * @param func - Function to debounce
 * @param wait - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Check if element meets minimum touch target size (44x44px)
 * Per WCAG 2.1 Level AAA guidelines
 * 
 * @param element - HTML element to check
 * @returns true if meets minimum size
 */
export function meetsTouchTargetSize(element: HTMLElement): boolean {
  const MIN_SIZE = 44; // pixels
  const rect = element.getBoundingClientRect();
  return rect.width >= MIN_SIZE && rect.height >= MIN_SIZE;
}

/**
 * Get all interactive elements on the page
 * 
 * @returns Array of interactive HTML elements
 */
export function getInteractiveElements(): HTMLElement[] {
  if (typeof document === 'undefined') {
    return [];
  }

  const selectors = [
    'button',
    'a[href]',
    'input',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]',
    '[role="link"]',
  ];

  const elements = document.querySelectorAll(selectors.join(', '));
  return Array.from(elements) as HTMLElement[];
}

/**
 * Validate all interactive elements meet touch target size
 * 
 * @returns Object with validation results
 */
export function validateTouchTargets(): {
  valid: boolean;
  total: number;
  passing: number;
  failing: HTMLElement[];
} {
  const elements = getInteractiveElements();
  const failing: HTMLElement[] = [];

  elements.forEach((element) => {
    if (!meetsTouchTargetSize(element)) {
      failing.push(element);
    }
  });

  return {
    valid: failing.length === 0,
    total: elements.length,
    passing: elements.length - failing.length,
    failing,
  };
}
