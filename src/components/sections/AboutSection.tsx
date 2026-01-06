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
 * - Typewriter effect for summary text
 * 
 * Requirements: 3.1, 6.2, 6.3
 */
export const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  const { variants } = useAnimationConfig();
  
  // Typewriter effect for summary
  const typedSummary = useTypewriter({
    text: data.summary || '',
    speed: 100,
    delay: 500,
    enabled: true
  });

  // Debug - remove this later
  console.log('Typewriter:', { 
    original: typeof data.summary === 'string' ? data.summary.substring(0, 50) + '...' : 'Not a string', 
    typed: typeof typedSummary === 'string' ? typedSummary.substring(0, 50) + '...' : 'Not a string', 
    lengths: { original: data.summary?.length || 0, typed: typedSummary.length },
    dataType: typeof data.summary,
    data: data.summary
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
        <h1 className="text-3xl font-bold font-mono" style={{ color: 'var(--color-text)' }}>
          {data.name}
        </h1>
        <h2 className="text-xl font-mono" style={{ color: 'var(--color-accent)' }}>
          {data.title}
        </h2>
      </motion.div>

      {/* Summary section with typewriter effect */}
      <motion.div
        className="flex flex-col gap-4 items-center"
        variants={variants.staggerContainer}
      >
        <motion.p
          className="font-mono text-sm leading-relaxed relative text-center max-w-4xl"
          style={{ color: 'var(--color-text)' }}
        >
          {typedSummary}
          {/* Blinking cursor */}
          {typedSummary.length < (data.summary?.length || 0) && (
            <motion.span
              className="inline-block w-2 h-5 ml-1 bg-[#4ec9b0] align-text-bottom"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            />
          )}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
