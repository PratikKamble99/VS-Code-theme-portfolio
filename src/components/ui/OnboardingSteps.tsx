'use client';

import React, { useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useResponsive } from '@/hooks';

interface OnboardingStepsProps {
  isVisible: boolean;
  onComplete: () => void;
}

const steps: Step[] = [
  {
    target: 'body',
    content: (
      <div>
        <h2 className="text-xl font-bold mb-2">Welcome to My Portfolio! 👋</h2>
        <p>This is an interactive VS Code-themed portfolio. Let me show you around in a few quick steps.</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="sidebar-nav"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Navigation Sidebar</h3>
        <p>Use this sidebar to navigate between different sections: About, Skills, Experience, Projects, and Contact.</p>
      </div>
    ),
    placement: 'right',
    disableBeacon: true,
    disableScrolling: true,
  },
  {
    target: '[data-tour="terminal-button-taskbar"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Open the Terminal</h3>
        <p className="mb-2">Click this button in the taskbar or press the backtick key (`) to open the interactive terminal.</p>
        <div className="p-2 rounded bg-[var(--color-bgTertiary)] text-[var(--color-accent)] text-sm font-mono">
          💡 Try pressing: `
        </div>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
    disableScrolling: true,
  },
  {
    target: 'body',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Try Terminal Commands</h3>
        <p className="mb-2">Type commands like "help", "about", "projects", or "goto skills" to navigate and explore.</p>
        <div className="p-2 rounded bg-[var(--color-bgTertiary)] text-[var(--color-accent)] text-sm font-mono">
          💡 Open terminal and try: help
        </div>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: 'body',
    content: (
      <div>
        <h2 className="text-xl font-bold mb-2">You're All Set! 🎉</h2>
        <p>Feel free to explore the portfolio. You can always type "guide" in the terminal to see this tour again.</p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
];

export const OnboardingSteps: React.FC<OnboardingStepsProps> = ({ isVisible, onComplete }) => {
  const [run, setRun] = React.useState(false);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const { isMobile } = useResponsive();

  // Don't render on mobile (Requirement 5.1)
  if (isMobile) {
    return null;
  }

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure DOM is ready
      setTimeout(() => setRun(true), 300);
    } else {
      setRun(false);
      setCurrentStepIndex(0);
    }
  }, [isVisible]);

  // Add/remove focus class to current step element
  useEffect(() => {
    // Remove focus class from all elements
    document.querySelectorAll('[data-tour]').forEach(el => {
      el.classList.remove('tour-focused');
    });

    // Add focus class to current step element
    if (run && steps[currentStepIndex]?.target) {
      const targetSelector = steps[currentStepIndex].target;
      if (typeof targetSelector === 'string') {
        const target = document.querySelector(targetSelector);
        if (target) {
          target.classList.add('tour-focused');
        }
      }
    }

    return () => {
      // Cleanup on unmount
      document.querySelectorAll('[data-tour]').forEach(el => {
        el.classList.remove('tour-focused');
      });
    };
  }, [run, currentStepIndex]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // Update current step index for focus effect
    if (type === 'step:after' || type === 'tooltip') {
      setCurrentStepIndex(index);
    }

    if (finishedStatuses.includes(status)) {
      setRun(false);
      setCurrentStepIndex(0);
      onComplete();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <style jsx global>{`
        .__floater__open .react-joyride__spotlight {
          background-color: transparent !important;
          border: 3px solid var(--color-accent) !important;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 
                      0 0 30px rgba(78, 201, 176, 0.8),
                      0 0 60px rgba(78, 201, 176, 0.4) !important;
          animation: spotlight-pulse 2s ease-in-out infinite !important;
        }

        @keyframes spotlight-pulse {
          0%, 100% {
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 
                        0 0 30px rgba(78, 201, 176, 0.8),
                        0 0 60px rgba(78, 201, 176, 0.4);
            transform: scale(1);
            border-width: 3px;
          }
          50% {
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 
                        0 0 40px rgba(78, 201, 176, 1),
                        0 0 80px rgba(78, 201, 176, 0.6);
            transform: scale(1.02);
            border-width: 4px;
          }
        }

        /* Add pointer cursor to highlighted elements */
        .__floater__open .react-joyride__spotlight + * {
          cursor: pointer !important;
        }

        /* Ensure highlighted element is above overlay */
        [data-tour="sidebar-nav"],
        [data-tour="terminal-button-taskbar"] {
          position: relative;
        }

        /* Add extra focus effect ONLY to the current step's target element */
        .tour-focused {
          animation: element-focus-pulse 2s ease-in-out infinite !important;
          filter: brightness(1.2) !important;
          z-index: 10001 !important;
          outline: 2px solid var(--color-accent) !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 20px rgba(78, 201, 176, 0.6), 
                      0 0 40px rgba(78, 201, 176, 0.3) !important;
        }

        @keyframes element-focus-pulse {
          0%, 100% {
            filter: brightness(1.2);
            box-shadow: 0 0 20px rgba(78, 201, 176, 0.6), 
                        0 0 40px rgba(78, 201, 176, 0.3);
          }
          50% {
            filter: brightness(1.4);
            box-shadow: 0 0 30px rgba(78, 201, 176, 0.8), 
                        0 0 60px rgba(78, 201, 176, 0.5);
          }
        }
      `}</style>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showProgress
        showSkipButton
        disableOverlayClose
        disableCloseOnEsc={false}
        disableScrolling
        callback={handleJoyrideCallback}
        floaterProps={{
          disableAnimation: false,
        }}
        styles={{
        options: {
          arrowColor: 'var(--color-bgSecondary)',
          backgroundColor: 'var(--color-bgSecondary)',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          primaryColor: 'var(--color-accent)',
          textColor: 'var(--color-text)',
          width: 450,
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          padding: 24,
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace",
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipContent: {
          padding: '12px 0',
        },
        buttonNext: {
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-bg)',
          borderRadius: 6,
          padding: '8px 16px',
          fontSize: 14,
          fontWeight: 500,
          border: 'none',
          cursor: 'pointer',
        },
        buttonBack: {
          color: 'var(--color-textSecondary)',
          marginRight: 8,
          fontSize: 14,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        },
        buttonSkip: {
          color: 'var(--color-textSecondary)',
          fontSize: 14,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        },
        spotlight: {
          borderRadius: 8,
          backgroundColor: 'transparent',
        },
        overlay: {
          mixBlendMode: 'hard-light',
        },
        beacon: {
          display: 'none',
        },
      }}
      locale={{
        back: 'Previous',
        close: 'Close',
        last: 'Get Started',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
    </>
  );
};
