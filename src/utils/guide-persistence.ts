/**
 * Portfolio Guide State Persistence Utility
 * 
 * Handles saving and restoring guide dismissal state to/from session storage.
 * Implements requirements 1.5, 2.4
 */

const STORAGE_KEY = 'portfolio_guide_state';
const GUIDE_VERSION = '1.0.0';

/**
 * Guide storage data structure
 */
export interface GuideStorageData {
  dismissed: boolean;
  dismissedAt: string; // ISO timestamp
  version: string; // Guide version for future updates
}

/**
 * Save guide dismissal state to session storage
 * Requirement 2.4: Persist dismissal state to prevent showing it again
 */
export function saveGuideDismissed(dismissed: boolean): void {
  try {
    const data: GuideStorageData = {
      dismissed,
      dismissedAt: new Date().toISOString(),
      version: GUIDE_VERSION,
    };
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save guide state:', error);
    // Gracefully degrade - guide will show on every page load
  }
}

/**
 * Load guide dismissal state from session storage
 * Requirement 1.5: Do not display guide if previously dismissed
 */
export function loadGuideDismissed(): boolean {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return false; // Not dismissed if no data
    }
    
    const data = JSON.parse(stored) as GuideStorageData;
    
    // Validate data structure
    if (typeof data.dismissed !== 'boolean') {
      console.warn('Invalid guide state data, resetting');
      clearGuideState();
      return false;
    }
    
    // Check version compatibility (for future updates)
    // If guide version changes, we might want to show it again
    if (data.version !== GUIDE_VERSION) {
      console.info('Guide version changed, resetting state');
      clearGuideState();
      return false;
    }
    
    return data.dismissed;
  } catch (error) {
    console.warn('Failed to load guide state:', error);
    // On error, assume not dismissed (show guide)
    return false;
  }
}

/**
 * Check if guide has been dismissed
 * Convenience method for checking dismissal state
 */
export function isGuideDismissed(): boolean {
  return loadGuideDismissed();
}

/**
 * Clear guide state from session storage
 * Useful for testing or resetting the guide
 */
export function clearGuideState(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear guide state:', error);
  }
}

/**
 * Reset guide to show again
 * Marks guide as not dismissed
 */
export function resetGuide(): void {
  saveGuideDismissed(false);
}

/**
 * Check if session storage is available
 * Used for graceful degradation
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}
