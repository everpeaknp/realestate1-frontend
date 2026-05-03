'use client';

import { motion } from 'framer-motion';
import { FolderKanban } from 'lucide-react';

export default function Projects() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <FolderKanban className="w-6 h-6 sm:w-8 sm:h-8 text-[#c1a478]" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a]">Projects</h1>
        </div>
        <p className="text-base sm:text-lg text-[#5d6d87]">Our completed projects</p>
      </div>
    </motion.div>
  );
}
