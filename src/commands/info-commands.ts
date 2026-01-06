import { Command, CommandResult } from '@/types/terminal';
import { PortfolioData } from '@/types';

/**
 * Information commands: about, skills, experience, projects, contact
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

/**
 * About command - Display developer information
 */
export const aboutCommand: Command = {
  name: 'about',
  description: 'Display developer information',
  usage: 'about',
  
  execute: async (args, context) => {
    const data = context?.portfolioData as PortfolioData | undefined;
    
    if (!data?.about) {
      return {
        success: false,
        output: 'Portfolio data not available.',
        type: 'error'
      };
    }
    
    const { name, title, summary } = data.about;
    
    const output = `
╭─────────────────────────────────────────────────────────────╮
│                      About Me                               │
╰─────────────────────────────────────────────────────────────╯

👤 ${name}
💼 ${title}

${summary.join('\n\n')}

Type 'goto about' to see the full about section.
`;
    
    return {
      success: true,
      output: output.trim(),
      type: 'success'
    };
  }
};

/**
 * Skills command - Display technical skills
 */
export const skillsCommand: Command = {
  name: 'skills',
  description: 'Display technical skills',
  usage: 'skills',
  
  execute: async (args, context) => {
    const data = context?.portfolioData as PortfolioData | undefined;
    
    if (!data?.skills) {
      return {
        success: false,
        output: 'Skills data not available.',
        type: 'error'
      };
    }
    
    let output = `
╭─────────────────────────────────────────────────────────────╮
│                    Technical Skills                         │
╰─────────────────────────────────────────────────────────────╯

`;
    
    data.skills.forEach(skillGroup => {
      output += `\n${skillGroup.category}:\n`;
      output += skillGroup.items.map(item => `  • ${item}`).join('\n');
      output += '\n';
    });
    
    output += `\nType 'goto skills' to see the full skills section.`;
    
    return {
      success: true,
      output: output.trim(),
      type: 'success'
    };
  }
};

/**
 * Experience command - Display work experience
 */
export const experienceCommand: Command = {
  name: 'experience',
  description: 'Display work experience',
  usage: 'experience',
  aliases: ['work', 'exp'],
  
  execute: async (args, context) => {
    const data = context?.portfolioData as PortfolioData | undefined;
    
    if (!data?.experience) {
      return {
        success: false,
        output: 'Experience data not available.',
        type: 'error'
      };
    }
    
    let output = `
╭─────────────────────────────────────────────────────────────╮
│                   Work Experience                           │
╰─────────────────────────────────────────────────────────────╯

`;
    
    data.experience.forEach((exp, index) => {
      output += `\n${index + 1}. ${exp.position} at ${exp.company}\n`;
      output += `   📅 ${exp.duration}\n`;
      output += `   🛠️  ${exp.technologies.slice(0, 5).join(', ')}${exp.technologies.length > 5 ? '...' : ''}\n`;
    });
    
    output += `\nType 'goto experience' to see full details.`;
    
    return {
      success: true,
      output: output.trim(),
      type: 'success'
    };
  }
};

/**
 * Projects command - List all projects
 */
export const projectsCommand: Command = {
  name: 'projects',
  description: 'List all projects',
  usage: 'projects',
  
  execute: async (args, context) => {
    const data = context?.portfolioData as PortfolioData | undefined;
    
    if (!data?.projects) {
      return {
        success: false,
        output: 'Projects data not available.',
        type: 'error'
      };
    }
    
    let output = `
╭─────────────────────────────────────────────────────────────╮
│                       Projects                              │
╰─────────────────────────────────────────────────────────────╯

`;
    
    data.projects.forEach((project, index) => {
      const statusEmoji = 
        project.status === 'completed' ? '✅' :
        project.status === 'in-progress' ? '🚧' : '📦';
      
      output += `\n${index + 1}. ${statusEmoji} ${project.name}\n`;
      output += `   ${project.description.substring(0, 80)}${project.description.length > 80 ? '...' : ''}\n`;
      output += `   🛠️  ${project.technologies.slice(0, 4).join(', ')}${project.technologies.length > 4 ? '...' : ''}\n`;
    });
    
    output += `\nType 'goto projects' to see full project details.`;
    
    return {
      success: true,
      output: output.trim(),
      type: 'success'
    };
  }
};

/**
 * Contact command - Show contact information
 */
export const contactCommand: Command = {
  name: 'contact',
  description: 'Show contact information',
  usage: 'contact',
  
  execute: async (args, context) => {
    const data = context?.portfolioData as PortfolioData | undefined;
    
    if (!data?.contact) {
      return {
        success: false,
        output: 'Contact data not available.',
        type: 'error'
      };
    }
    
    const { email, github, linkedin, website, location } = data.contact;
    
    const output = `
╭─────────────────────────────────────────────────────────────╮
│                   Contact Information                       │
╰─────────────────────────────────────────────────────────────╯

📧 Email:    ${email}
🐙 GitHub:   ${github}
💼 LinkedIn: ${linkedin}
${website ? `🌐 Website:  ${website}\n` : ''}📍 Location: ${location}

💬 Send me a message:
   send-message "Your message here"

🔗 Quick links:
   open-github    - Open GitHub profile
   open-linkedin  - Open LinkedIn profile
`;
    
    return {
      success: true,
      output: output.trim(),
      type: 'success'
    };
  }
};

/**
 * Get all information commands
 */
export function getInfoCommands(): Command[] {
  return [
    aboutCommand,
    skillsCommand,
    experienceCommand,
    projectsCommand,
    contactCommand
  ];
}

export default {
  aboutCommand,
  skillsCommand,
  experienceCommand,
  projectsCommand,
  contactCommand,
  getInfoCommands
};
