'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-24 h-24 text-red-500" />
        </div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </motion.div>
  );
}
