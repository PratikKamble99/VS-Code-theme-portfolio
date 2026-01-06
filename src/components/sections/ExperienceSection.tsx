'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationConfig } from '@/components/providers';
import { Experience } from '@/types';

interface ExperienceSectionProps {
  data: Experience[];
}

/**
 * ExperienceSection component displays work experience with timeline animations
 * 
 * Features:
 * - Slide-in animations for timeline items
 * - Display chronological work experience
 * - Include company, position, duration, and technologies
 * 
 * Requirements: 3.3, 6.2, 6.3
 */
export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ data }) => {
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
        Work Experience
      </motion.h1>

      {/* Timeline container */}
      <motion.div
        className="flex flex-col gap-6"
        variants={variants.staggerContainer}
      >
        {data.map((experience, index) => (
          <motion.div
            key={experience.id}
            className="relative flex gap-6 group"
            variants={variants.slideIn}
          >
            {/* Timeline line and dot */}
            <div className="relative flex flex-col items-center">
              {/* Timeline dot */}
              <div 
                className="w-4 h-4 rounded-full border-2 z-10 group-hover:scale-125 transition-transform"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  borderColor: 'var(--color-bg)'
                }}
              />
              
              {/* Timeline line (only show if not the last item) */}
              {index < data.length - 1 && (
                <div className="w-0.5 h-full mt-2" style={{ backgroundColor: 'var(--color-border)' }} />
              )}
            </div>

            {/* Experience content card */}
            <motion.div
              className="flex-1 p-6 border rounded-md hover:border-[var(--color-accent)] transition-colors mb-6"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)'
              }}
              whileHover={{ x: 4 }}
            >
              {/* Header: Position and Company */}
              <div className="flex flex-col gap-2 mb-4">
                <h3 className="text-xl font-semibold font-mono" style={{ color: 'var(--color-text)' }}>
                  {experience.position}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-mono font-medium" style={{ color: 'var(--color-accent)' }}>
                    {experience.company}
                  </span>
                  <span className="font-mono text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                    {experience.duration}
                  </span>
                </div>
              </div>

              {/* Description list */}
              <ul className="flex flex-col gap-2 mb-4 list-disc list-inside">
                {experience.description.map((item, descIndex) => (
                  <li
                    key={descIndex}
                    className="font-mono text-sm leading-relaxed"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                {experience.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 text-xs font-mono rounded border"
                    style={{
                      backgroundColor: 'var(--color-bgTertiary)',
                      color: 'var(--color-success)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
