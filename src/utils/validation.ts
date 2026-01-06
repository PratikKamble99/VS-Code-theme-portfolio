import { 
  CommandHistoryItem, 
  CommandResult, 
  Project, 
  Skill, 
  Experience, 
  ContactInfo, 
  PortfolioData 
} from '@/types';

/**
 * Validation utilities for portfolio data models
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateCommandHistoryItem(item: any): item is CommandHistoryItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    typeof item.command === 'string' &&
    item.command.length > 0 &&
    typeof item.output === 'string' &&
    item.timestamp instanceof Date
  );
}

export function validateCommandResult(result: any): result is CommandResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    typeof result.success === 'boolean' &&
    typeof result.output === 'string' &&
    (result.error === undefined || typeof result.error === 'string')
  );
}

export function validateProject(project: any): project is Project {
  if (
    typeof project !== 'object' ||
    project === null ||
    typeof project.id !== 'string' ||
    project.id.length === 0 ||
    typeof project.name !== 'string' ||
    project.name.length === 0 ||
    typeof project.description !== 'string' ||
    project.description.length === 0 ||
    !Array.isArray(project.technologies) ||
    !project.technologies.every((tech: any) => typeof tech === 'string') ||
    typeof project.links !== 'object' ||
    project.links === null ||
    !['completed', 'in-progress', 'archived'].includes(project.status)
  ) {
    return false;
  }

  // Validate optional link URLs
  const { github, demo, docs } = project.links;
  if (github !== undefined && (typeof github !== 'string' || !isValidUrl(github))) {
    return false;
  }
  if (demo !== undefined && (typeof demo !== 'string' || !isValidUrl(demo))) {
    return false;
  }
  if (docs !== undefined && (typeof docs !== 'string' || !isValidUrl(docs))) {
    return false;
  }

  return true;
}

export function validateSkill(skill: any): skill is Skill {
  return (
    typeof skill === 'object' &&
    skill !== null &&
    typeof skill.category === 'string' &&
    skill.category.length > 0 &&
    Array.isArray(skill.items) &&
    skill.items.length > 0 &&
    skill.items.every((item: any) => typeof item === 'string' && item.length > 0)
  );
}

export function validateExperience(experience: any): experience is Experience {
  return (
    typeof experience === 'object' &&
    experience !== null &&
    typeof experience.id === 'string' &&
    experience.id.length > 0 &&
    typeof experience.company === 'string' &&
    experience.company.length > 0 &&
    typeof experience.position === 'string' &&
    experience.position.length > 0 &&
    typeof experience.duration === 'string' &&
    experience.duration.length > 0 &&
    Array.isArray(experience.description) &&
    experience.description.length > 0 &&
    experience.description.every((desc: any) => typeof desc === 'string' && desc.length > 0) &&
    Array.isArray(experience.technologies) &&
    experience.technologies.length > 0 &&
    experience.technologies.every((tech: any) => typeof tech === 'string' && tech.length > 0)
  );
}

export function validateContactInfo(contact: any): contact is ContactInfo {
  if (
    typeof contact !== 'object' ||
    contact === null ||
    typeof contact.email !== 'string' ||
    !isValidEmail(contact.email) ||
    typeof contact.github !== 'string' ||
    !isValidUrl(contact.github) ||
    typeof contact.linkedin !== 'string' ||
    !isValidUrl(contact.linkedin) ||
    typeof contact.location !== 'string' ||
    contact.location.length === 0
  ) {
    return false;
  }

  // Validate optional website URL
  if (contact.website !== undefined && (typeof contact.website !== 'string' || !isValidUrl(contact.website))) {
    return false;
  }

  return true;
}

export function validatePortfolioData(data: any): data is PortfolioData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  // Validate about section
  if (
    typeof data.about !== 'object' ||
    data.about === null ||
    typeof data.about.name !== 'string' ||
    data.about.name.length === 0 ||
    typeof data.about.title !== 'string' ||
    data.about.title.length === 0 ||
    !Array.isArray(data.about.summary) ||
    data.about.summary.length === 0 ||
    !data.about.summary.every((item: any) => typeof item === 'string' && item.length > 0)
  ) {
    return false;
  }

  // Validate skills array
  if (!Array.isArray(data.skills) || data.skills.length === 0 || !data.skills.every(validateSkill)) {
    return false;
  }

  // Validate projects array
  if (!Array.isArray(data.projects) || data.projects.length === 0 || !data.projects.every(validateProject)) {
    return false;
  }

  // Validate experience array
  if (!Array.isArray(data.experience) || data.experience.length === 0 || !data.experience.every(validateExperience)) {
    return false;
  }

  // Validate contact info
  if (!validateContactInfo(data.contact)) {
    return false;
  }

  return true;
}

/**
 * Utility function to create a validated CommandHistoryItem
 */
export function createCommandHistoryItem(command: string, output: string): CommandHistoryItem {
  return {
    id: crypto.randomUUID(),
    command,
    output,
    timestamp: new Date()
  };
}

/**
 * Utility function to create a CommandResult
 */
export function createCommandResult(success: boolean, output: string, error?: string): CommandResult {
  return {
    success,
    output,
    error
  };
}