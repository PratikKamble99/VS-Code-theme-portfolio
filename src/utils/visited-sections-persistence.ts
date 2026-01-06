/**
 * Visited Sections State Persistence Utility
 * 
 * Handles saving and restoring visited sections state to/from session storage.
 * Implements requirements 1.2, 1.4
 */

const STORAGE_KEY = 'portfolio_visited_sections';
const MAX_SECTIONS = 10; // Reasonable limit to prevent storage bloat

/**
 * Valid section identifiers
 */
export type SectionId = 'about' | 'skills' | 'experience' | 'projects' | 'contact';

const VALID_SECTIONS: SectionId[] = ['about', 'skills', 'experience', 'projects', 'contact'];

/**
 * Visited sections storage data structure
 */
export interface VisitedSectionsData {
  sections: SectionId[];
  timestamp: number;
}

/**
 * Validate if a section ID is valid
 */
export function isValidSection(section: string): section is SectionId {
  return VALID_SECTIONS.includes(section as SectionId);
}

/**
 * Save visited sections to session storage
 * Requirement 1.2: Track visited sections for tab display
 */
export function saveVisitedSections(sections: string[]): void {
  try {
    // Filter to only valid sections
    const validSections = sections.filter(isValidSection);
    
    // Limit to MAX_SECTIONS
    const limitedSections = validSections.slice(-MAX_SECTIONS);
    
    const data: VisitedSectionsData = {
      sections: limitedSections,
      timestamp: Date.now(),
    };
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save visited sections:', error);
    // Gracefully degrade - sections won't persist across refreshes
  }
}

/**
 * Load visited sections from session storage
 * Requirement 1.4: Display all visited sections in tab bar
 */
export function loadVisitedSections(): string[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return []; // No visited sections yet
    }
    
    const data = JSON.parse(stored) as VisitedSectionsData;
    
    // Validate data structure
    if (!Array.isArray(data.sections)) {
      console.warn('Invalid visited sections data, resetting');
      clearVisitedSections();
      return [];
    }
    
    // Filter to only valid sections (in case data is corrupted)
    const validSections = data.sections.filter(isValidSection);
    
    return validSections;
  } catch (error) {
    console.warn('Failed to load visited sections:', error);
    // On error, return empty array
    return [];
  }
}

/**
 * Add a section to visited sections
 * Only adds if not already present (maintains original order)
 */
export function addVisitedSection(section: string): string[] {
  // Validate section
  if (!isValidSection(section)) {
    console.warn(`Invalid section ID: ${section}`);
    return loadVisitedSections();
  }
  
  const currentSections = loadVisitedSections();
  
  // If section already exists, do not change order
  if (currentSections.includes(section)) {
    return currentSections;
  }
  
  // Add section to end only if it is new
  const updatedSections = [...currentSections, section];
  
  // Save and return
  saveVisitedSections(updatedSections);
  return updatedSections;
}

/**
 * Remove a section from visited sections
 * Returns the updated list and the section to navigate to (if current was removed)
 * Prevents removing the last tab (at least one must remain open)
 */
export function removeVisitedSection(section: string, currentSection: string): { 
  sections: string[]; 
  navigateTo: string | null;
} {
  const currentSections = loadVisitedSections();
  
  // Prevent closing the last tab - at least one must remain open
  if (currentSections.length <= 1) {
    console.warn('Cannot close the last tab');
    return { sections: currentSections, navigateTo: null };
  }
  
  const sectionIndex = currentSections.indexOf(section);
  
  // If section not found, return current state
  if (sectionIndex === -1) {
    return { sections: currentSections, navigateTo: null };
  }
  
  // Remove the section
  const updatedSections = currentSections.filter(s => s !== section);
  
  // Save updated sections
  saveVisitedSections(updatedSections);
  
  // Determine where to navigate if we removed the active section
  let navigateTo: string | null = null;
  if (section === currentSection && updatedSections.length > 0) {
    // Navigate to the most recent section (last in array)
    navigateTo = updatedSections[updatedSections.length - 1];
  }
  
  return { sections: updatedSections, navigateTo };
}

/**
 * Clear visited sections from session storage
 */
export function clearVisitedSections(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear visited sections:', error);
  }
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
