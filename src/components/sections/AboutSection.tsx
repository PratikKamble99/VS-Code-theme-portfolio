'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PortfolioData } from '@/types';
import { useAnimationConfig } from '@/components/providers';
import { AsciiAvatar } from '@/components/ui';
import { useTypewriter } from '@/hooks';

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
 * - Typewriter effect for name text
 * - Slide-up animation for summary
 * 
 * Requirements: 3.1, 6.2, 6.3
 */
export const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  const { variants } = useAnimationConfig();
  
  // Typewriter effect for name
  const typedName = useTypewriter({
    text: data.name || '',
    speed: 100,
    delay: 800,
    enabled: true
  });

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
        className="w-full flex justify-center overflow-x-auto"
        variants={variants.scaleIn}
      >
        <AsciiAvatar
          // imageUrl={data.avatar}
          width={150}
          height={80}
          fontSize={8}
        />
      </motion.div>

      {/* Name and title */}
      <motion.div
        className="flex flex-col gap-2 text-center"
        variants={variants.fadeIn}
      >
        <h1 className="text-3xl font-bold font-mono relative" style={{ color: 'var(--color-text)' }}>
          {typedName}
          {/* Blinking cursor for name */}
          {typedName.length < (data.name?.length || 0) && (
            <motion.span
              className="inline-block w-2 h-8 ml-1 bg-[#4ec9b0] align-text-bottom"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            />
          )}
        </h1>
        <motion.h2 
          className="text-xl font-mono" 
          style={{ color: 'var(--color-accent)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          {data.title}
        </motion.h2>
      </motion.div>

      {/* Summary section with slide-up animation */}
      <motion.div
        className="flex flex-col gap-4 items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: 1.5, // Start after name typewriter is mostly done
          ease: "easeOut" 
        }}
      >
        <motion.p
          className="font-mono text-sm leading-relaxed text-center max-w-4xl"
          style={{ color: 'var(--color-text)' }}
        >
          {data.summary}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
