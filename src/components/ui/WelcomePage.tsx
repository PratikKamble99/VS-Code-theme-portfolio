'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

/**
 * WelcomePage - Landing page with Kiro branding and animated welcome message
 * 
 * Features:
 * - Large Kiro logo
 * - Animated welcome message with typewriter effect
 * - Call-to-action to explore portfolio
 * - Smooth animations and transitions
 */
export const WelcomePage: React.FC = () => {
  const router = useRouter();
  const [displayedText, setDisplayedText] = useState('');
  const [showCTA, setShowCTA] = useState(false);
  
  const welcomeMessage = 'Welcome to my interactive portfolio';

  useEffect(() => {
    // Typewriter effect for welcome message
    let currentIndex = 0;
    const typewriterInterval = setInterval(() => {
      if (currentIndex <= welcomeMessage.length) {
        setDisplayedText(welcomeMessage.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
        // Show CTA after message is complete
        setTimeout(() => setShowCTA(true), 500);
      }
    }, 60);

    return () => clearInterval(typewriterInterval);
  }, []);

  const handleExplore = () => {
    router.push('/about');
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-8"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="max-w-4xl w-full flex flex-col items-center gap-12">
        {/* Kiro Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
          className="flex flex-col items-center gap-6"
        >
          {/* Large Code Icon */}
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg 
              width="120" 
              height="120" 
              viewBox="0 0 16 16" 
              fill="currentColor"
              style={{ color: 'var(--color-accent)' }}
            >
              <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
            </svg>
          </motion.div>

          {/* Kiro Name */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-center"
            style={{ 
              color: 'var(--color-text)',
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace"
            }}
          >
            Pratik Kamble
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl md:text-2xl"
            style={{ color: 'var(--color-accent)' }}
          >
            Full Stack Developer
          </motion.p>
        </motion.div>

        {/* Animated Welcome Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <p 
            className="text-2xl md:text-3xl font-medium min-h-[3rem]"
            style={{ 
              color: 'var(--color-text)',
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace"
            }}
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-0.5 h-8 ml-1 align-middle"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
          </p>
        </motion.div>

        {/* Call to Action */}
        {showCTA && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.button
              onClick={handleExplore}
              className="px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-bg)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0, 122, 204, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Portfolio →
            </motion.button>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <motion.button
                onClick={() => router.push('/projects')}
                className="px-4 py-2 rounded transition-all duration-200"
                style={{ 
                  color: 'var(--color-textSecondary)',
                  borderWidth: '1px',
                  borderColor: 'var(--color-border)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
              </motion.button>

              <motion.button
                onClick={() => router.push('/experience')}
                className="px-4 py-2 rounded transition-all duration-200"
                style={{ 
                  color: 'var(--color-textSecondary)',
                  borderWidth: '1px',
                  borderColor: 'var(--color-border)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Experience
              </motion.button>

              <motion.button
                onClick={() => router.push('/contact')}
                className="px-4 py-2 rounded transition-all duration-200"
                style={{ 
                  color: 'var(--color-textSecondary)',
                  borderWidth: '1px',
                  borderColor: 'var(--color-border)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
              </motion.button>

              <motion.button
                onClick={() => {
                  // Trigger guide - we'll need to pass this as a prop or use a global state
                  const event = new CustomEvent('showGuide');
                  window.dispatchEvent(event);
                }}
                className="px-4 py-2 rounded transition-all duration-200"
                style={{ 
                  color: 'var(--color-textSecondary)',
                  borderWidth: '1px',
                  borderColor: 'var(--color-border)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)'
                }}
                whileTap={{ scale: 0.95 }}
                title="Show interactive guide (F1)"
              >
                📖 Guide
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Scroll Indicator */}
        {showCTA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ 
              opacity: { delay: 1, duration: 0.6 },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-8"
            onClick={handleExplore}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 16 16" 
              fill="currentColor"
              style={{ color: 'var(--color-textMuted)' }}
            >
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
