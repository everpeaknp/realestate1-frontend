'use client';

import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export default function FAQs() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <HelpCircle className="w-8 h-8" />
          <h1 className="text-4xl font-bold">FAQs</h1>
        </div>
        <p className="text-lg text-gray-600">Frequently asked questions</p>
      </div>
    </motion.div>
  );
}
