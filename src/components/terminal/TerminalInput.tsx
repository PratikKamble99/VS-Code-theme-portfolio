'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { TerminalInputProps } from '@/types/terminal';

/**
 * TerminalInput - Command input field with history navigation and autocomplete
 * 
 * Features:
 * - Command history navigation (Up/Down arrows)
 * - Tab key autocomplete
 * - Command suggestions dropdown
 * - Input validation
 * - Loading state
 * - Disabled state
 * - Auto-focus management
 * 
 * Requirements: 1.5, 4.3, 4.4, 4.5, 10.1, 10.2, 10.3, 10.4
 */
export const TerminalInput: React.FC<TerminalInputProps> = ({
  onSubmit,
  commandHistory,
  disabled = false,
  placeholder = "Type 'help' for available commands...",
  onGetSuggestions,
}) => {
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempInput, setTempInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when component mounts or becomes enabled
  useEffect(() => {
    if (!disabled && inputRef.current) {
      // Small delay to ensure the terminal is fully rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [disabled]);

  // Update suggestions when input changes
  useEffect(() => {
    if (input && onGetSuggestions && historyIndex === -1) {
      // Only get suggestions for the command part (first word)
      const commandPart = input.trim().split(' ')[0];
      if (commandPart) {
        const newSuggestions = onGetSuggestions(commandPart);
        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
        setSelectedSuggestionIndex(0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input, onGetSuggestions, historyIndex]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle command submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const trimmedInput = input.trim();
    
    if (!trimmedInput || disabled) {
      return;
    }

    // Submit the command
    onSubmit(trimmedInput);
    
    // Clear input and reset history navigation
    setInput('');
    setHistoryIndex(-1);
    setTempInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(0);
    
    // Re-focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Apply autocomplete suggestion
  const applySuggestion = (suggestion: string) => {
    // Get the rest of the input after the command
    const parts = input.trim().split(' ');
    const args = parts.slice(1).join(' ');
    
    // Set the input to the suggestion plus any arguments
    const newInput = args ? `${suggestion} ${args}` : suggestion;
    setInput(newInput);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(0);
    
    // Re-focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Tab - Autocomplete
    if (e.key === 'Tab') {
      e.preventDefault();
      
      if (showSuggestions && suggestions.length > 0) {
        // Apply the selected suggestion
        applySuggestion(suggestions[selectedSuggestionIndex]);
      } else if (input && onGetSuggestions) {
        // Try to get suggestions if we don't have any
        const commandPart = input.trim().split(' ')[0];
        if (commandPart) {
          const newSuggestions = onGetSuggestions(commandPart);
          if (newSuggestions.length > 0) {
            applySuggestion(newSuggestions[0]);
          }
        }
      }
      return;
    }
    
    // Up/Down arrows when suggestions are visible - navigate suggestions
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        return;
      }
    }
    
    // Up arrow - navigate to previous command in history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      
      if (commandHistory.length === 0) return;
      
      // Save current input if we're starting to navigate history
      if (historyIndex === -1) {
        setTempInput(input);
      }
      
      const newIndex = historyIndex === -1 
        ? commandHistory.length - 1 
        : Math.max(0, historyIndex - 1);
      
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    // Down arrow - navigate to next command in history
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      
      if (historyIndex === -1) return;
      
      const newIndex = historyIndex + 1;
      
      if (newIndex >= commandHistory.length) {
        // Restore the temporary input
        setInput(tempInput);
        setHistoryIndex(-1);
        setTempInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    // Escape - Close suggestions or propagate to parent
    else if (e.key === 'Escape') {
      if (showSuggestions) {
        // Close suggestions and prevent propagation
        e.preventDefault();
        e.stopPropagation();
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(0);
      }
      // If no suggestions, let it propagate to parent (TerminalPanel will close)
    }
    
    // Requirement 10.4: Ctrl+C - Clear current input (parent handles cancellation)
    else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault(); // Prevent default browser behavior
      setInput('');
      setHistoryIndex(-1);
      setTempInput('');
      setSuggestions([]);
      setShowSuggestions(false);
      // Note: Parent (TerminalPanel) handles command cancellation when loading
    }
    
    // Requirement 10.2: Ctrl+L - Clear input (parent handles terminal clear)
    else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault(); // Prevent default browser behavior
      setInput('');
      setHistoryIndex(-1);
      setTempInput('');
      setSuggestions([]);
      setShowSuggestions(false);
      // Note: Parent (TerminalPanel) handles clearing terminal output
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    // Reset history navigation when user types
    if (historyIndex !== -1) {
      setHistoryIndex(-1);
      setTempInput('');
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div 
          className="flex items-center gap-2 text-[#d4d4d4] cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Prompt */}
          <span className="text-[#4ec9b0] select-none flex-shrink-0">➜</span>
          <span className="text-[#569cd6] select-none flex-shrink-0">portfolio</span>
          
          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className={`
              flex-1 bg-transparent outline-none text-[#d4d4d4] 
              placeholder-[#6a6a6a] font-mono
              min-h-[44px] sm:min-h-0
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            autoComplete="off"
            spellCheck="false"
            aria-label="Terminal command input"
            aria-autocomplete="list"
            aria-controls={showSuggestions ? 'command-suggestions' : undefined}
            aria-expanded={showSuggestions}
          />
          
          {/* Cursor */}
          {!disabled && (
            <span className="w-2 h-4 bg-[#d4d4d4] animate-pulse"></span>
          )}
          
          {/* Loading Indicator */}
          {disabled && (
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-[#4ec9b0] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-[#4ec9b0] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-[#4ec9b0] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          id="command-suggestions"
          role="listbox"
          className="absolute bottom-full left-0 mb-2 w-full max-w-md bg-[#252526] border border-[#3e3e3e] rounded shadow-lg overflow-hidden z-50"
        >
          <div className="px-3 py-2 text-xs text-[#858585] border-b border-[#3e3e3e] bg-[#2d2d2d]">
            Command suggestions (Tab to complete)
          </div>
          <div className="max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                role="option"
                aria-selected={index === selectedSuggestionIndex}
                onClick={() => applySuggestion(suggestion)}
                onMouseEnter={() => setSelectedSuggestionIndex(index)}
                className={`
                  w-full px-4 py-2 text-left text-sm font-mono
                  transition-colors duration-100
                  ${index === selectedSuggestionIndex
                    ? 'bg-[#094771] text-[#ffffff]'
                    : 'text-[#d4d4d4] hover:bg-[#2a2d2e]'
                  }
                `}
              >
                <span className="text-[#4ec9b0]">➜</span> {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalInput;
