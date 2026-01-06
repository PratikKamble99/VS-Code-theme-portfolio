import { useState, useCallback } from 'react';
import { portfolioData } from '@/data/portfolio';

interface Tab {
  id: string;
  name: string;
  extension: string;
  isDirty?: boolean;
  content: string;
}

interface EditorState {
  tabs: Tab[];
  activeTab?: string;
  sidebarVisible: boolean;
}

export function useEditorState() {
  const [state, setState] = useState<EditorState>({
    tabs: [],
    activeTab: undefined,
    sidebarVisible: true,
  });

  // Generate file content based on portfolio data
  const generateFileContent = useCallback((fileName: string): string => {
    switch (fileName) {
      case 'about.ts':
        return `// About Information
export interface AboutInfo {
  name: string;
  title: string;
  summary: string[];
}

export const about: AboutInfo = {
  name: "${portfolioData.about.name}",
  title: "${portfolioData.about.title}",
  summary: [
${portfolioData.about.summary.map(line => `    "${line}"`).join(',\n')}
  ]
};

// Personal details and background
export const personalDetails = {
  location: "${portfolioData.contact.location}",
  email: "${portfolioData.contact.email}",
  website: "${portfolioData.contact.website || 'https://portfolio.dev'}",
  availability: "Open to new opportunities"
};`;

      case 'projects.ts':
        return `// Projects Portfolio
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
}

export const projects: Project[] = [
${portfolioData.projects.map(project => `  {
    id: "${project.id}",
    name: "${project.name}",
    description: "${project.description}",
    technologies: [${project.technologies.map(tech => `"${tech}"`).join(', ')}],
    links: {
${Object.entries(project.links).map(([key, value]) => `      ${key}: "${value}"`).join(',\n')}
    },
    status: "${project.status}"
  }`).join(',\n')}
];

// Project utilities
export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getProjectsByTechnology = (tech: string): Project[] => {
  return projects.filter(project => 
    project.technologies.some(t => 
      t.toLowerCase().includes(tech.toLowerCase())
    )
  );
};`;

      case 'skills.json':
        return JSON.stringify({
          skills: portfolioData.skills,
          metadata: {
            lastUpdated: new Date().toISOString(),
            totalCategories: portfolioData.skills.length,
            totalSkills: portfolioData.skills.reduce((acc, category) => acc + category.items.length, 0)
          },
          categories: portfolioData.skills.map(skill => ({
            name: skill.category,
            count: skill.items.length,
            items: skill.items
          }))
        }, null, 2);

      case 'experience.ts':
        return `// Professional Experience
export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string[];
  technologies: string[];
}

export const experience: Experience[] = [
${portfolioData.experience.map(exp => `  {
    id: "${exp.id}",
    company: "${exp.company}",
    position: "${exp.position}",
    duration: "${exp.duration}",
    description: [
${exp.description.map(desc => `      "${desc}"`).join(',\n')}
    ],
    technologies: [${exp.technologies.map(tech => `"${tech}"`).join(', ')}]
  }`).join(',\n')}
];

// Experience utilities
export const getCurrentPosition = (): Experience | undefined => {
  return experience.find(exp => exp.duration.includes('Present'));
};

export const getExperienceByCompany = (company: string): Experience[] => {
  return experience.filter(exp => 
    exp.company.toLowerCase().includes(company.toLowerCase())
  );
};`;

      case 'contact.json':
        return JSON.stringify({
          contact: portfolioData.contact,
          social: {
            github: portfolioData.contact.github,
            linkedin: portfolioData.contact.linkedin,
            email: portfolioData.contact.email
          },
          availability: {
            status: "available",
            preferredContact: "email",
            timezone: "UTC-8",
            responseTime: "24-48 hours"
          }
        }, null, 2);

      default:
        return `// ${fileName}
// File content not available`;
    }
  }, []);

  // Open a file in a new tab
  const openFile = useCallback((fileName: string) => {
    setState(prev => {
      // Check if tab already exists
      const existingTab = prev.tabs.find(tab => tab.name === fileName);
      if (existingTab) {
        return {
          ...prev,
          activeTab: existingTab.id
        };
      }

      // Create new tab
      const extension = fileName.split('.').pop() || '';
      const newTab: Tab = {
        id: fileName,
        name: fileName,
        extension,
        content: generateFileContent(fileName),
        isDirty: false
      };

      return {
        ...prev,
        tabs: [...prev.tabs, newTab],
        activeTab: newTab.id
      };
    });
  }, [generateFileContent]);

  // Close a tab
  const closeTab = useCallback((tabId: string) => {
    setState(prev => {
      const newTabs = prev.tabs.filter(tab => tab.id !== tabId);
      let newActiveTab = prev.activeTab;

      // If closing active tab, switch to another tab
      if (prev.activeTab === tabId) {
        if (newTabs.length > 0) {
          const currentIndex = prev.tabs.findIndex(tab => tab.id === tabId);
          const nextIndex = Math.min(currentIndex, newTabs.length - 1);
          newActiveTab = newTabs[nextIndex]?.id;
        } else {
          newActiveTab = undefined;
        }
      }

      return {
        ...prev,
        tabs: newTabs,
        activeTab: newActiveTab
      };
    });
  }, []);

  // Select a tab
  const selectTab = useCallback((tabId: string) => {
    setState(prev => ({
      ...prev,
      activeTab: tabId
    }));
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = useCallback(() => {
    setState(prev => ({
      ...prev,
      sidebarVisible: !prev.sidebarVisible
    }));
  }, []);

  // Get active tab content
  const getActiveTabContent = useCallback(() => {
    if (!state.activeTab) return '';
    const activeTab = state.tabs.find(tab => tab.id === state.activeTab);
    return activeTab?.content || '';
  }, [state.activeTab, state.tabs]);

  // Get active tab name
  const getActiveTabName = useCallback(() => {
    if (!state.activeTab) return undefined;
    const activeTab = state.tabs.find(tab => tab.id === state.activeTab);
    return activeTab?.name;
  }, [state.activeTab, state.tabs]);

  // Open file based on command
  const openFileFromCommand = useCallback((command: string) => {
    const commandMap: Record<string, string> = {
      'about': 'about.ts',
      'projects': 'projects.ts',
      'skills': 'skills.json',
      'experience': 'experience.ts',
      'contact': 'contact.json'
    };

    const fileName = commandMap[command.toLowerCase()];
    if (fileName) {
      openFile(fileName);
    }
  }, [openFile]);

  return {
    ...state,
    openFile,
    closeTab,
    selectTab,
    toggleSidebar,
    getActiveTabContent,
    getActiveTabName,
    openFileFromCommand
  };
}