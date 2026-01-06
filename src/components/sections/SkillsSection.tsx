'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationConfig } from '@/components/providers';
import { Skill } from '@/types';

interface SkillsSectionProps {
  data: Skill[];
}

/**
 * SkillsSection component displays technical skills with staggered animations
 * 
 * Features:
 * - Staggered fade-in for skill categories
 * - Display skills in organized groups
 * - Consistent typography and spacing
 * 
 * Requirements: 3.2, 6.2, 6.3
 */
export const SkillsSection: React.FC<SkillsSectionProps> = ({ data }) => {
  const { variants } = useAnimationConfig();

  return (
    <motion.div
      className="flex flex-col gap-8 max-w-4xl"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants.staggerContainer}
    >
      {/* Section header */}
      <motion.h1
        className="text-3xl font-bold font-mono"
        style={{ color: 'var(--color-text)' }}
        variants={variants.staggerItem}
      >
        Skills & Technologies
      </motion.h1>

      {/* Skills grid with staggered animation */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={variants.staggerContainer}
      >
        {data.map((skillCategory, index) => (
          <motion.div
            key={index}
            className="flex flex-col gap-3 p-4 border rounded-md hover:border-[var(--color-accent)] transition-colors"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: 'var(--color-border)'
            }}
            variants={variants.staggerItem}
          >
            {/* Category name */}
            <h3 className="text-lg font-semibold font-mono" style={{ color: 'var(--color-accent)' }}>
              {skillCategory.category}
            </h3>

            {/* Skills list */}
            <div className="flex flex-wrap gap-2">
              {skillCategory.items.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="px-3 py-1 text-sm font-mono rounded border hover:border-[var(--color-accent)] transition-colors"
                  style={{
                    backgroundColor: 'var(--color-bgTertiary)',
                    color: 'var(--color-text)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Optional proficiency indicator */}
            {skillCategory.proficiency && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono" style={{ color: 'var(--color-textSecondary)' }}>
                  Proficiency:
                </span>
                <span className="text-xs font-mono capitalize" style={{ color: 'var(--color-success)' }}>
                  {skillCategory.proficiency}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
