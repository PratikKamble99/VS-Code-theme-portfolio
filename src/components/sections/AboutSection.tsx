'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PortfolioData } from '@/types';
import { useAnimationConfig } from '@/components/providers';
import { AsciiAvatar } from '@/components/ui';

interface AboutSectionProps {
  data: PortfolioData['about'];
}

/**
 * AboutSection component displays developer information with fade-in animations
 * 
 * Features:
 * - Fade-in animation for content
 * - Display developer name, title, and summary
 * - Optional avatar with scale animation
 * 
 * Requirements: 3.1, 6.2, 6.3
 */
export const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  const { variants } = useAnimationConfig();

  return (
    <motion.div
      className="flex flex-col gap-8 max-w-6xl"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants.fadeIn}
    >
      {/* ASCII Art Avatar - Full width for better visibility */}
      <motion.div
        className="w-full flex justify-center"
        variants={variants.scaleIn}
      >
        <AsciiAvatar
          imageUrl={data.avatar}
          width={100}
          height={50}
          fontSize={8}
        />
      </motion.div>

      {/* Name and title */}
      <motion.div
        className="flex flex-col gap-2 text-center"
        variants={variants.fadeIn}
      >
        <h1 className="text-3xl font-bold font-mono" style={{ color: 'var(--color-text)' }}>
          {data.name}
        </h1>
        <h2 className="text-xl font-mono" style={{ color: 'var(--color-accent)' }}>
          {data.title}
        </h2>
        <p className="text-xs font-mono mt-2" style={{ color: 'var(--color-textSecondary)' }}>
          💡 Hover over the ASCII art for interactive effects
        </p>
      </motion.div>

      {/* Summary section with staggered fade-in */}
      <motion.div
        className="flex flex-col gap-4 items-center"
        variants={variants.staggerContainer}
      >
        {data.summary.map((paragraph, index) => (
          <motion.p
            key={index}
            className="font-mono text-sm leading-relaxed"
            style={{ color: 'var(--color-text)' }}
            variants={variants.staggerItem}
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.div>
    </motion.div>
  );
};
