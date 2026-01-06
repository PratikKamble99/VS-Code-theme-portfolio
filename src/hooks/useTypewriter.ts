import { useState, useEffect, useCallback } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  variableSpeed?: boolean;
  onComplete?: () => void;
}

export function useTypewriter({ 
  text, 
  speed = 50, 
  delay = 0, 
  variableSpeed = false,
  onComplete 
}: UseTypewriterOptions) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Calculate realistic typing speed with variations
  const getTypingSpeed = useCallback((char: string, index: number): number => {
    if (!variableSpeed) return speed;

    let baseSpeed = speed;
    
    // Slower for punctuation and special characters
    if (/[.!?;:]/.test(char)) {
      baseSpeed *= 2;
    }
    // Faster for common letters
    else if (/[aeiou]/.test(char.toLowerCase())) {
      baseSpeed *= 0.8;
    }
    // Pause after sentences
    else if (char === '\n') {
      baseSpeed *= 3;
    }
    // Slight random variation for realism
    const variation = variableSpeed ? (Math.random() * 0.4 + 0.8) : 1;
    
    return Math.floor(baseSpeed * variation);
  }, [speed, variableSpeed]);

  useEffect(() => {
    if (!text) return;

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    setDisplayText('');
    setIsComplete(false);

    const startTyping = () => {
      const typeNextCharacter = () => {
        if (currentIndex < text.length) {
          const currentChar = text[currentIndex];
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
          
          const nextSpeed = getTypingSpeed(currentChar, currentIndex);
          timeoutId = setTimeout(typeNextCharacter, nextSpeed);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      };

      timeoutId = setTimeout(typeNextCharacter, delay);
    };

    startTyping();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [text, delay, getTypingSpeed, onComplete]);

  return { displayText, isComplete };
}

// Hook for typing multiple lines with realistic pauses
export function useMultiLineTypewriter(lines: string[], options: Omit<UseTypewriterOptions, 'text'> = {}) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [isAllComplete, setIsAllComplete] = useState(false);

  const currentLine = lines[currentLineIndex] || '';
  
  const { displayText, isComplete } = useTypewriter({
    text: currentLine,
    ...options,
    onComplete: () => {
      if (currentLineIndex < lines.length - 1) {
        setCompletedLines(prev => [...prev, currentLine]);
        setCurrentLineIndex(prev => prev + 1);
      } else {
        setCompletedLines(prev => [...prev, currentLine]);
        setIsAllComplete(true);
      }
    }
  });

  // Reset when lines change
  useEffect(() => {
    setCurrentLineIndex(0);
    setCompletedLines([]);
    setIsAllComplete(false);
  }, [lines]);

  const allDisplayText = [...completedLines, displayText].join('\n');

  return { 
    displayText: allDisplayText, 
    isComplete: isAllComplete,
    currentLineIndex,
    completedLines: completedLines.length
  };
}