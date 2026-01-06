import { useState, useEffect, useCallback } from 'react';
import {
  loadGuideDismissed,
  saveGuideDismissed,
  isStorageAvailable,
} from '@/utils/guide-persistence';

/**
 * Custom hook for managing portfolio guide state
 * 
 * Handles guide visibility and dismissal state with persistence
 * Implements requirements 1.1, 1.5, 2.2, 2.4
 */

export interface UseGuideStateReturn {
  isVisible: boolean;
  hasBeenDismissed: boolean;
  showGuide: () => void;
  hideGuide: () => void;
  dismissGuide: () => void;
  isStorageSupported: boolean;
}

export function useGuideState(): UseGuideStateReturn {
  // Track if guide is currently visible
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  // Track if guide has been dismissed (persisted)
  const [hasBeenDismissed, setHasBeenDismissed] = useState<boolean>(false);
  
  // Track if storage is available
  const [isStorageSupported] = useState<boolean>(isStorageAvailable());

  console.log('[useGuideState] Hook initialized');
  console.log('[useGuideState] isVisible:', isVisible);
  console.log('[useGuideState] hasBeenDismissed:', hasBeenDismissed);

  // Load dismissal state from storage on mount
  // Requirement 1.5: Do not display guide if previously dismissed
  useEffect(() => {
    console.log('[useGuideState] useEffect running');
    const dismissed = loadGuideDismissed();
    console.log('[useGuideState] Loaded dismissed state:', dismissed);
    setHasBeenDismissed(dismissed);
    
    // Show guide on first visit (if not dismissed)
    // Requirement 1.1: Display guide on first visit
    if (!dismissed) {
      console.log('[useGuideState] Guide not dismissed, will show in 500ms');
      // Small delay to ensure layout is ready
      const timer = setTimeout(() => {
        console.log('[useGuideState] Setting isVisible to true');
        setIsVisible(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      console.log('[useGuideState] Guide was dismissed, not showing');
    }
  }, []);

  /**
   * Show the guide
   * Can be called manually via command or programmatically
   */
  const showGuide = useCallback(() => {
    console.log('[useGuideState] showGuide called');
    setIsVisible(true);
  }, []);

  /**
   * Hide the guide without persisting dismissal
   * Useful for temporary hiding
   */
  const hideGuide = useCallback(() => {
    console.log('[useGuideState] hideGuide called');
    setIsVisible(false);
  }, []);

  /**
   * Dismiss the guide and persist the dismissal state
   * Requirement 2.2: Hide guide and store dismissal state
   * Requirement 2.4: Persist dismissal state
   */
  const dismissGuide = useCallback(() => {
    console.log('[useGuideState] dismissGuide called');
    setIsVisible(false);
    setHasBeenDismissed(true);
    saveGuideDismissed(true);
  }, []);

  return {
    isVisible,
    hasBeenDismissed,
    showGuide,
    hideGuide,
    dismissGuide,
    isStorageSupported,
  };
}
