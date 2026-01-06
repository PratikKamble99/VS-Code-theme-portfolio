// Terminal-specific TypeScript interfaces

export type TerminalEntryType = 'success' | 'error' | 'info' | 'warning';

export interface TerminalEntry {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
  type: TerminalEntryType;
  isLoading?: boolean;
}

export interface CommandResult {
  success: boolean;
  output: string;
  type: TerminalEntryType;
  data?: any;
}

export interface Command {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  execute: (args: string[], context?: CommandContext) => Promise<CommandResult>;
  validate?: (args: string[]) => boolean;
}

export interface CommandContext {
  navigateToSection?: (section: string) => void;
  setTheme?: (theme: 'dark' | 'light') => void;
  portfolioData?: any;
  commandHistory?: string[];
  commandExecutor?: any; // Reference to the CommandExecutor instance for help command
  showGuide?: () => void; // Callback to show the portfolio guide
}

export interface MessagePayload {
  message: string;
  sender?: {
    name?: string;
    email?: string;
  };
  timestamp: Date;
  source: 'terminal';
}

export interface MessageResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface TerminalState {
  isVisible: boolean;
  height: number;
  history: TerminalEntry[];
  commandHistory: string[];
}

export interface TerminalPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  onNavigate?: (section: string) => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
  className?: string;
  showGuide?: () => void;
}

export interface TerminalInputProps {
  onSubmit: (command: string) => void;
  commandHistory: string[];
  disabled?: boolean;
  placeholder?: string;
  onGetSuggestions?: (partial: string) => string[];
}

export interface TerminalOutputProps {
  history: TerminalEntry[];
  isLoading?: boolean;
}

export interface TerminalHeaderProps {
  onToggle: () => void;
  onClear: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}
