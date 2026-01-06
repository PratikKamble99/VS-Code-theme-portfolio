'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

/**
 * LoadingScreen - Displays a loading animation on startup
 * 
 * Features:
 * - Animated loading text with typewriter effect
 * - Progress bar animation
 * - Smooth fade out when complete
 * - VS Code themed styling
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  const fullText = 'Loading Portfolio...';

  useEffect(() => {
    // Typewriter effect for loading text
    let currentIndex = 0;
    const typewriterInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setLoadingText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
      }
    }, 50);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsComplete(true);
            if (onLoadingComplete) {
              setTimeout(onLoadingComplete, 500);
            }
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      clearInterval(typewriterInterval);
      clearInterval(progressInterval);
    };
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            backgroundColor: 'var(--color-bg)',
          }}
        >
          <div className="flex flex-col items-center gap-8">
            {/* VS Code Logo or Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 16 16" 
                fill="currentColor"
                style={{ color: 'var(--color-accent)' }}
              >
                <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
              </svg>
            </motion.div>

            {/* Loading Text with Typewriter Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-semibold"
              style={{ 
                color: 'var(--color-text)',
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace"
              }}
            >
              {loadingText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-6 ml-1"
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
            </motion.div>

            {/* Progress Bar */}
            <div className="w-80 max-w-[90vw]">
              <div 
                className="h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--color-bgTertiary)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ 
                    backgroundColor: 'var(--color-accent)',
                    width: `${progress}%`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              {/* Progress Percentage */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-center mt-3"
                style={{ color: 'var(--color-textSecondary)' }}
              >
                {progress}%
              </motion.div>
            </div>

            {/* Loading Messages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm"
              style={{ color: 'var(--color-textSecondary)' }}
            >
              {progress < 30 && 'Initializing components...'}
              {progress >= 30 && progress < 60 && 'Loading assets...'}
              {progress >= 60 && progress < 90 && 'Preparing interface...'}
              {progress >= 90 && 'Almost ready...'}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
