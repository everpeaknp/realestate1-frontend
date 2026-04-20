'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function AboutMe() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <User className="w-8 h-8" />
          <h1 className="text-4xl font-bold">About Me</h1>
        </div>
        <p className="text-lg text-gray-600">Learn more about our team</p>
      </div>
    </motion.div>
  );
}
