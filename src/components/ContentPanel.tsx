'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationConfig } from '@/components/providers';
import { AboutSection, SkillsSection, ExperienceSection, ProjectsSection, ContactSection } from '@/components/sections';
import { PortfolioData } from '@/types';

interface ContentPanelProps {
  section: string;
  data: PortfolioData;
}

/**
 * ContentPanel component - Main content area with animated section transitions
 * 
 * Responsibilities:
 * - Section rendering based on current navigation state
 * - Animation orchestration using Framer Motion
 * - Content display with smooth transitions
 * 
 * Requirements: 1.2, 1.4, 7.1
 */
export const ContentPanel: React.FC<ContentPanelProps> = ({ section, data }) => {
  const { variants } = useAnimationConfig();

  /**
   * Renders the appropriate section content based on the current section
   * Falls back to "about" section for invalid section identifiers
   */
  const renderSectionContent = () => {
    const normalizedSection = section.toLowerCase();

    switch (normalizedSection) {
      case 'about':
        return <AboutSection data={data.about} />;

      case 'skills':
        return <SkillsSection data={data.skills} />;

      case 'experience':
        return <ExperienceSection data={data.experience} />;

      case 'projects':
        return <ProjectsSection data={data.projects} />;

      case 'contact':
        return <ContactSection data={data.contact} />;

      default:
        // Fallback to about section for invalid section identifiers
        return <AboutSection data={data.about} />;
    }
  };

  return (
    <div 
      className="flex-1 overflow-y-auto p-8"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants.fadeIn}
          className="max-w-5xl mx-auto"
        >
          {renderSectionContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
