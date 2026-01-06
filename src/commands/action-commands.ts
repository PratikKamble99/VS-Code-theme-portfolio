import { getMessageService } from '@/services/message-service';
import { Command } from '@/types/terminal';

/**
 * Action commands: goto, theme, download-resume, open-github, open-linkedin, send-message
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5
 */

const validSections = ['about', 'skills', 'experience', 'projects', 'contact'];

/**
 * Send Message command - Send a message to the portfolio owner
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
export const sendMessageCommand: Command = {
  name: 'send-message',
  description: 'Send a message to the portfolio owner',
  usage: 'send-message [message] or send-message (for interactive prompt)',
  aliases: ['message', 'msg', 'contact-send'],
  
  execute: async (args) => {
    const messageService = getMessageService();
    
    // Check if message service can send (not rate limited)
    if (!messageService.canSendMessage()) {
      return {
        success: false,
        output: `⏱ Please wait before sending another message.\n\nYou can send a message every ${messageService.getCooldownPeriod()} seconds to prevent spam.`,
        type: 'error'
      };
    }
    
    // If no arguments provided, show interactive prompt instructions
    if (args.length === 0) {
      return {
        success: false,
        output: `📧 Send a message to the portfolio owner\n\nUsage:\n  send-message <your message here>\n\nExample:\n  send-message Hello! I'd like to discuss a project opportunity.\n\nNote: Messages must be at least 10 characters long.`,
        type: 'info'
      };
    }
    
    // Join all arguments to form the message
    const message = args.join(' ');
    
    // Send the message
    try {
      const result = await messageService.sendMessage(message);
      
      if (result.success) {
        return {
          success: true,
          output: `${result.message}\n\nThank you for reaching out! 🎉`,
          type: 'success',
          data: { action: 'send-message', timestamp: new Date() }
        };
      } else {
        return {
          success: false,
          output: result.message,
          type: 'error',
          data: { error: result.error }
        };
      }
    } catch (error) {
      return {
        success: false,
        output: `✗ An unexpected error occurred while sending your message.\n\nPlease try again later or use the contact form.`,
        type: 'error',
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
};

/**
 * Goto command - Navigate to a portfolio section
 * Requirements: 3.4
 */
export const gotoCommand: Command = {
  name: 'goto',
  description: 'Navigate to a portfolio section',
  usage: 'goto <section>',
  aliases: ['nav', 'go', 'navigate'],
  
  validate: (args) => {
    if (args.length === 0) {
      return false;
    }
    return validSections.includes(args[0].toLowerCase());
  },
  
  execute: async (args, context) => {
    if (args.length === 0) {
      return {
        success: false,
        output: `Please specify a section to navigate to.\n\nAvailable sections:\n${validSections.map(s => `  • ${s}`).join('\n')}\n\nUsage: goto <section>`,
        type: 'error'
      };
    }
    
    const section = args[0].toLowerCase();
    
    if (!validSections.includes(section)) {
      return {
        success: false,
        output: `Invalid section '${section}'.\n\nAvailable sections:\n${validSections.map(s => `  • ${s}`).join('\n')}`,
        type: 'error'
      };
    }
    
    // Call the navigation function from context
    if (context?.navigateToSection) {
      context.navigateToSection(section);
    }
    
    return {
      success: true,
      output: `✓ Navigated to ${section} section`,
      type: 'success',
      data: { action: 'navigate', section }
    };
  }
};

/**
 * Theme command - Switch color theme
 * Requirements: 3.5
 */
export const themeCommand: Command = {
  name: 'theme',
  description: 'Switch color theme',
  usage: 'theme <dark|light>',
  
  validate: (args) => {
    if (args.length === 0) {
      return false;
    }
    return ['dark', 'light'].includes(args[0].toLowerCase());
  },
  
  execute: async (args, context) => {
    if (args.length === 0) {
      return {
        success: false,
        output: 'Please specify a theme.\n\nAvailable themes:\n  • dark\n  • light\n\nUsage: theme <dark|light>',
        type: 'error'
      };
    }
    
    const theme = args[0].toLowerCase() as 'dark' | 'light';
    
    if (!['dark', 'light'].includes(theme)) {
      return {
        success: false,
        output: `Invalid theme '${theme}'.\n\nAvailable themes:\n  • dark\n  • light`,
        type: 'error'
      };
    }
    
    // Call the theme function from context
    if (context?.setTheme) {
      context.setTheme(theme);
    }
    
    return {
      success: true,
      output: `✓ Switched to ${theme} theme`,
      type: 'success',
      data: { action: 'theme', theme }
    };
  }
};

/**
 * Download Resume command
 * Requirements: 3.1
 */
export const downloadResumeCommand: Command = {
  name: 'download-resume',
  description: 'Download resume PDF',
  usage: 'download-resume',
  aliases: ['resume', 'cv', 'download-cv'],
  
  execute: async (args, context) => {
    try {
      // Get portfolio data for resume information
      const data = context?.portfolioData;
      const name = data?.about?.name || 'Resume';
      
      // Create a download link for the resume
      // In a real implementation, this would point to an actual PDF file
      const resumePath = '/resume.pdf'; // This should be placed in the public folder
      
      if (typeof window !== 'undefined') {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = resumePath;
        link.download = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return {
          success: true,
          output: `📥 Downloading resume...\n\n✓ ${name}'s resume download initiated.`,
          type: 'success',
          data: { action: 'download', file: 'resume', path: resumePath }
        };
      } else {
        return {
          success: false,
          output: '✗ Download is only available in browser environment.',
          type: 'error'
        };
      }
    } catch (error) {
      return {
        success: false,
        output: `✗ Failed to download resume.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
};

/**
 * Open GitHub command
 * Requirements: 3.2
 */
export const openGithubCommand: Command = {
  name: 'open-github',
  description: 'Open GitHub profile in new tab',
  usage: 'open-github',
  aliases: ['github', 'gh'],
  
  execute: async (args, context) => {
    const data = context?.portfolioData;
    const githubUrl = data?.contact?.github;
    
    if (!githubUrl) {
      return {
        success: false,
        output: 'GitHub URL not available.',
        type: 'error'
      };
    }
    
    // Open in new tab
    if (typeof window !== 'undefined') {
      window.open(githubUrl, '_blank', 'noopener,noreferrer');
    }
    
    return {
      success: true,
      output: `✓ Opening GitHub profile...\n${githubUrl}`,
      type: 'success',
      data: { action: 'open-link', url: githubUrl }
    };
  }
};

/**
 * Open LinkedIn command
 * Requirements: 3.3
 */
export const openLinkedinCommand: Command = {
  name: 'open-linkedin',
  description: 'Open LinkedIn profile in new tab',
  usage: 'open-linkedin',
  aliases: ['linkedin', 'li'],
  
  execute: async (args, context) => {
    const data = context?.portfolioData;
    const linkedinUrl = data?.contact?.linkedin;
    
    if (!linkedinUrl) {
      return {
        success: false,
        output: 'LinkedIn URL not available.',
        type: 'error'
      };
    }
    
    // Open in new tab
    if (typeof window !== 'undefined') {
      window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
    }
    
    return {
      success: true,
      output: `✓ Opening LinkedIn profile...\n${linkedinUrl}`,
      type: 'success',
      data: { action: 'open-link', url: linkedinUrl }
    };
  }
};

/**
 * Get all action commands
 */
export function getActionCommands(): Command[] {
  return [
    sendMessageCommand,
    gotoCommand,
    themeCommand,
    downloadResumeCommand,
    openGithubCommand,
    openLinkedinCommand
  ];
}

export default {
  sendMessageCommand,
  gotoCommand,
  themeCommand,
  downloadResumeCommand,
  openGithubCommand,
  openLinkedinCommand,
  getActionCommands
};
