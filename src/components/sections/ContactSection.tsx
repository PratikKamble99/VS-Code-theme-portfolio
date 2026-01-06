'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationConfig } from '@/components/providers';
import { ContactInfo } from '@/types';

interface ContactSectionProps {
  data: ContactInfo;
}

/**
 * ContactSection component displays contact information with scale animations
 * 
 * Features:
 * - Scale animations for contact links
 * - Display email, social links, and location
 * - Hover effects for interactive elements
 * 
 * Requirements: 3.4, 6.2, 6.3
 */
export const ContactSection: React.FC<ContactSectionProps> = ({ data }) => {
  const { variants } = useAnimationConfig();

  // Contact items configuration
  const contactItems = [
    {
      label: 'Email',
      value: data.email,
      href: `mailto:${data.email}`,
      icon: '📧',
      type: 'email' as const
    },
    {
      label: 'GitHub',
      value: data.github.replace('https://', ''),
      href: data.github,
      icon: '🔗',
      type: 'link' as const
    },
    {
      label: 'LinkedIn',
      value: data.linkedin.replace('https://', ''),
      href: data.linkedin,
      icon: '💼',
      type: 'link' as const
    },
    ...(data.website ? [{
      label: 'Website',
      value: data.website.replace('https://', ''),
      href: data.website,
      icon: '🌐',
      type: 'link' as const
    }] : []),
    {
      label: 'Location',
      value: data.location,
      href: null,
      icon: '📍',
      type: 'text' as const
    }
  ];

  return (
    <motion.div
      className="flex flex-col gap-8 max-w-4xl"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants.fadeIn}
    >
      {/* Header */}
      <motion.div variants={variants.fadeIn}>
        <h1 className="text-3xl font-bold font-mono mb-2" style={{ color: 'var(--color-text)' }}>
          Get In Touch
        </h1>
        <p className="font-mono text-sm" style={{ color: 'var(--color-textSecondary)' }}>
          Feel free to reach out for collaborations, opportunities, or just to say hello!
        </p>
      </motion.div>

      {/* Contact items with staggered scale animations */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={variants.staggerContainer}
      >
        {contactItems.map((item, index) => (
          <motion.div
            key={index}
            variants={variants.scaleIn}
            whileHover={item.href ? { 
              scale: 1.05,
              transition: { duration: 0.2 }
            } : undefined}
            className={`
              border rounded-lg p-4
              ${item.href ? 'cursor-pointer hover:border-[var(--color-accent)] transition-colors' : ''}
            `}
            style={{
              backgroundColor: 'var(--color-bgSecondary)',
              borderColor: 'var(--color-border)'
            }}
          >
            {item.href ? (
              <a
                href={item.href}
                target={item.type === 'link' ? '_blank' : undefined}
                rel={item.type === 'link' ? 'noopener noreferrer' : undefined}
                className="flex items-start gap-3 group"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-mono text-xs uppercase tracking-wide" style={{ color: 'var(--color-textSecondary)' }}>
                    {item.label}
                  </span>
                  <span className="font-mono text-sm group-hover:text-[var(--color-accent)] transition-colors break-all" style={{ color: 'var(--color-text)' }}>
                    {item.value}
                  </span>
                </div>
              </a>
            ) : (
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-mono text-xs uppercase tracking-wide" style={{ color: 'var(--color-textSecondary)' }}>
                    {item.label}
                  </span>
                  <span className="font-mono text-sm break-all" style={{ color: 'var(--color-text)' }}>
                    {item.value}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Additional message */}
      <motion.div
        variants={variants.fadeIn}
        className="border rounded-lg p-6 mt-4"
        style={{
          backgroundColor: 'var(--color-bgSecondary)',
          borderColor: 'var(--color-border)'
        }}
      >
        <p className="font-mono text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
          <span style={{ color: 'var(--color-accent)' }}>{'//'} </span>
          I&apos;m always interested in hearing about new projects and opportunities.
          Whether you have a question or just want to connect, feel free to reach out!
        </p>
      </motion.div>
    </motion.div>
  );
};
