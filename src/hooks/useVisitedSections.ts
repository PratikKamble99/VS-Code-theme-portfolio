import { useState, useEffect, useCallback } from 'react';
import {
  loadVisitedSections,
  saveVisitedSections,
  addVisitedSection as addVisitedSectionUtil,
  removeVisitedSection as removeVisitedSectionUtil,
  clearVisitedSections as clearVisitedSectionsUtil,
  isStorageAvailable,
} from '@/utils/visited-sections-persistence';

/**
 * Custom hook for managing visited sections state
 * 
 * Handles visited sections tracking with session storage persistence
 * Implements requirements 1.2, 1.4
 */

export interface UseVisitedSectionsReturn {
  visitedSections: string[];
  addVisitedSection: (section: string) => void;
  removeVisitedSection: (section: string, currentSection: string) => string | null;
  clearVisitedSections: () => void;
  isStorageSupported: boolean;
}

export function useVisitedSections(): UseVisitedSectionsReturn {
  // Track visited sections
  const [visitedSections, setVisitedSections] = useState<string[]>([]);
  
  // Track if storage is available
  const [isStorageSupported] = useState<boolean>(isStorageAvailable());

  // Load visited sections from storage on mount
  // Requirement 1.4: Display all visited sections
  useEffect(() => {
    const sections = loadVisitedSections();
    setVisitedSections(sections);
  }, []);

  /**
   * Add a section to visited sections
   * Prevents duplicates and maintains order
   * Requirement 1.2: Track sections as they are visited
   */
  const addVisitedSection = useCallback((section: string) => {
    const updatedSections = addVisitedSectionUtil(section);
    setVisitedSections(updatedSections);
  }, []);

  /**
   * Remove a section from visited sections
   * Returns the section to navigate to if current was removed
   */
  const removeVisitedSection = useCallback((section: string, currentSection: string) => {
    const { sections: updatedSections, navigateTo } = removeVisitedSectionUtil(section, currentSection);
    setVisitedSections(updatedSections);
    return navigateTo;
  }, []);

  /**
   * Clear all visited sections
   * Useful for testing or resetting state
   */
  const clearVisitedSections = useCallback(() => {
    clearVisitedSectionsUtil();
    setVisitedSections([]);
  }, []);

  return {
    visitedSections,
    addVisitedSection,
    removeVisitedSection,
    clearVisitedSections,
    isStorageSupported,
  };
}
