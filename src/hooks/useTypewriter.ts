import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  enabled?: boolean;
}

/**
 * Custom hook for typewriter effect
 * 
 * @param text - The text to display with typewriter effect
 * @param speed - Speed of typing in milliseconds per character (default: 50)
 * @param delay - Initial delay before starting in milliseconds (default: 0)
 * @param enabled - Whether the effect is enabled (default: true)
 * @returns The current displayed text
 */
export function useTypewriter({
  text,
  speed = 50,
  delay = 0,
  enabled = true
}: UseTypewriterOptions): string {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If disabled, show full text immediately
    if (!enabled) {
      setDisplayedText(text);
      return;
    }

    // Reset state
    setDisplayedText('');
    indexRef.current = 0;

    // Start typing after delay
    const startTyping = () => {
      const typeNextChar = () => {
        if (indexRef.current < text.length) {
          setDisplayedText(text.slice(0, indexRef.current + 1));
          indexRef.current++;
          timeoutRef.current = setTimeout(typeNextChar, speed);
        }
      };
      typeNextChar();
    };

    timeoutRef.current = setTimeout(startTyping, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, delay, enabled]);

  return displayedText;
}
