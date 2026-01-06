// Core TypeScript interfaces for the portfolio application

export interface AnimationVariant {
  hidden: object;
  visible: object;
  exit?: object;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  section: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  links: {
    github?: string;
    demo?: string;
    docs?: string;
  };
  status: 'completed' | 'in-progress' | 'archived';
  image?: string;
}

export interface Skill {
  category: string;
  items: string[];
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string[];
  technologies: string[];
  startDate: string;
  endDate?: string;
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  website?: string;
  location: string;
}

export interface PortfolioData {
  about: {
    name: string;
    title: string;
    summary: string;
    avatar?: string;
  };
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  contact: ContactInfo;
}

// Legacy types for old terminal components (to be removed in task 12)
export interface CommandResult {
  output: string;
  error?: boolean | string;
  success?: boolean;
}

export interface CommandHistoryItem {
  id?: string;
  command: string;
  timestamp: Date;
  result?: CommandResult;
  output?: string;
}