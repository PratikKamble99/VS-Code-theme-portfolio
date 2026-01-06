'use client';

import { ProjectsSection } from '@/components/sections';
import { portfolioData } from '@/data';
import { motion } from 'framer-motion';

export default function ProjectsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-8 max-w-5xl mx-auto"
    >
      <ProjectsSection data={portfolioData.projects} />
    </motion.div>
  );
}
