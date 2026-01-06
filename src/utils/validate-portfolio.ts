import { validatePortfolioData } from './validation';
import { portfolioData } from '@/data/portfolio';

/**
 * Validate the portfolio data structure
 * This file can be run to verify data integrity
 */
export function checkPortfolioData() {
  const isValid = validatePortfolioData(portfolioData);
  
  if (isValid) {
    console.log('✅ Portfolio data is valid');
    console.log(`- About: ${portfolioData.about.name} (${portfolioData.about.title})`);
    console.log(`- Skills: ${portfolioData.skills.length} categories`);
    console.log(`- Projects: ${portfolioData.projects.length} projects`);
    console.log(`- Experience: ${portfolioData.experience.length} positions`);
    console.log(`- Contact: ${portfolioData.contact.email}`);
  } else {
    console.error('❌ Portfolio data validation failed');
  }
  
  return isValid;
}

// Run validation if this file is executed directly
if (typeof window === 'undefined') {
  checkPortfolioData();
}