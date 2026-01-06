'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { Variants } from 'framer-motion';

/**
 * Animation variant definitions for consistent animations across the application
 */
interface AnimationVariants {
  fadeIn: Variants;
  slideIn: Variants;
  slideInFromRight: Variants;
  staggerContainer: Variants;
  staggerItem: Variants;
  scaleIn: Variants;
}

/**
 * Animation configuration context
 */
interface AnimationConfig {
  variants: AnimationVariants;
  reducedMotion: boolean;
  transitionDefaults: {
    duration: number;
    ease: string | number[];
  };
}

const AnimationContext = createContext<AnimationConfig | null>(null);

/**
 * Hook to access animation configuration and variants
 */
export const useAnimationConfig = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationConfig must be used within AnimationProvider');
  }
  return context;
};

/**
 * Detects if user prefers reduced motion
 */
const useReducedMotion = (): boolean => {
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
};

interface AnimationProviderProps {
  children: React.ReactNode;
}

/**
 * AnimationProvider - Provides shared animation variants and configuration
 * Implements reduced motion detection and performance optimizations
 */
export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const reducedMotion = useReducedMotion();

  const animationConfig = useMemo<AnimationConfig>(() => {
    const duration = reducedMotion ? 0 : 0.3;
    const staggerDelay = reducedMotion ? 0 : 0.1;

    return {
      reducedMotion,
      transitionDefaults: {
        duration: reducedMotion ? 0 : 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
      variants: {
        fadeIn: {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { duration, ease: [0.4, 0.0, 0.2, 1] }
          },
          exit: { opacity: 0, transition: { duration: duration * 0.5 } }
        },
        slideIn: {
          hidden: { x: -20, opacity: 0 },
          visible: { 
            x: 0, 
            opacity: 1,
            transition: { duration: reducedMotion ? 0 : 0.4, ease: [0.4, 0.0, 0.2, 1] }
          },
          exit: { x: -20, opacity: 0, transition: { duration: duration * 0.5 } }
        },
        slideInFromRight: {
          hidden: { x: 20, opacity: 0 },
          visible: { 
            x: 0, 
            opacity: 1,
            transition: { duration: reducedMotion ? 0 : 0.4, ease: [0.4, 0.0, 0.2, 1] }
          },
          exit: { x: 20, opacity: 0, transition: { duration: duration * 0.5 } }
        },
        staggerContainer: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: staggerDelay,
              delayChildren: reducedMotion ? 0 : 0.1
            }
          },
          exit: {
            opacity: 0,
            transition: {
              staggerChildren: staggerDelay * 0.5,
              staggerDirection: -1
            }
          }
        },
        staggerItem: {
          hidden: { y: 20, opacity: 0 },
          visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration, ease: [0.4, 0.0, 0.2, 1] }
          },
          exit: { y: 20, opacity: 0, transition: { duration: duration * 0.5 } }
        },
        scaleIn: {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { 
            scale: 1, 
            opacity: 1,
            transition: { 
              duration,
              ease: [0.4, 0.0, 0.2, 1],
              scale: {
                type: reducedMotion ? 'tween' : 'spring',
                stiffness: 200,
                damping: 20
              }
            }
          },
          exit: { scale: 0.8, opacity: 0, transition: { duration: duration * 0.5 } }
        }
      }
    };
  }, [reducedMotion]);

  return (
    <AnimationContext.Provider value={animationConfig}>
      {children}
    </AnimationContext.Provider>
  );
};

export const getAnimationVariants = (config: AnimationConfig) => config.variants;