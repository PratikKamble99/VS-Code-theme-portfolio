'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationConfig } from '@/components/providers';
import { Project } from '@/types';

interface ProjectsSectionProps {
  data: Project[];
}

/**
 * ProjectsSection component displays projects with grid and card animations
 * 
 * Features:
 * - Staggered grid animations for project cards
 * - Project card expand/collapse functionality
 * - Display project details with smooth transitions
 * - Status badges and technology tags
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 6.2, 6.3
 */
export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ data }) => {
  const { variants } = useAnimationConfig();
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const handleProjectClick = (projectId: string) => {
    // Toggle expand/collapse
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'text-[#4ec9b0] border-[#4ec9b0]';
      case 'in-progress':
        return 'text-[#dcdcaa] border-[#dcdcaa]';
      case 'archived':
        return 'text-[#858585] border-[#858585]';
      default:
        return 'text-[#d4d4d4] border-[#d4d4d4]';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-8 max-w-6xl"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants.staggerContainer}
    >
      {/* Section header */}
      <motion.h1
        className="text-3xl font-bold font-mono"
        style={{ color: 'var(--color-text)' }}
        variants={variants.staggerItem}
      >
        Projects
      </motion.h1>

      {/* Projects grid with staggered animation */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={variants.staggerContainer}
      >
        {data.map((project) => {
          const isExpanded = expandedProjectId === project.id;

          return (
            <motion.div
              key={project.id}
              className={`flex flex-col p-6 border rounded-md cursor-pointer hover:border-[var(--color-accent)] transition-colors ${
                isExpanded ? 'md:col-span-2' : ''
              }`}
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)'
              }}
              variants={variants.staggerItem}
              onClick={() => handleProjectClick(project.id)}
              layout
              transition={{ layout: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] } }}
            >
              {/* Project header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold font-mono mb-2" style={{ color: 'var(--color-text)' }}>
                    {project.name}
                  </h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-mono border rounded ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusLabel(project.status)}
                  </span>
                </div>

                {/* Expand/collapse indicator */}
                <motion.div
                  className="font-mono text-xl"
                  style={{ color: 'var(--color-accent)' }}
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.div>
              </div>

              {/* Project description */}
              <p className="font-mono text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text)' }}>
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 text-xs font-mono rounded border"
                    style={{
                      backgroundColor: 'var(--color-bgTertiary)',
                      color: 'var(--color-success)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Expanded details with AnimatePresence */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="flex flex-col gap-4 pt-4 border-t"
                    style={{ borderColor: 'var(--color-border)' }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                  >
                    {/* Project links */}
                    {(project.links.github || project.links.demo || project.links.docs) && (
                      <div className="flex flex-wrap gap-3">
                        {project.links.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 font-mono text-sm rounded border hover:border-[var(--color-accent)] transition-colors"
                            style={{
                              backgroundColor: 'var(--color-bgTertiary)',
                              color: 'var(--color-text)',
                              borderColor: 'var(--color-border)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>→</span>
                            <span>GitHub</span>
                          </a>
                        )}
                        {project.links.demo && (
                          <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 font-mono text-sm rounded border hover:border-[var(--color-accent)] transition-colors"
                            style={{
                              backgroundColor: 'var(--color-bgTertiary)',
                              color: 'var(--color-text)',
                              borderColor: 'var(--color-border)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>→</span>
                            <span>Live Demo</span>
                          </a>
                        )}
                        {project.links.docs && (
                          <a
                            href={project.links.docs}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 font-mono text-sm rounded border hover:border-[var(--color-accent)] transition-colors"
                            style={{
                              backgroundColor: 'var(--color-bgTertiary)',
                              color: 'var(--color-text)',
                              borderColor: 'var(--color-border)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>→</span>
                            <span>Documentation</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Optional project image */}
                    {project.image && (
                      <motion.div
                        className="w-full rounded overflow-hidden border"
                        style={{ borderColor: 'var(--color-border)' }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        <img
                          src={project.image}
                          alt={`${project.name} screenshot`}
                          className="w-full h-auto object-cover"
                        />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
