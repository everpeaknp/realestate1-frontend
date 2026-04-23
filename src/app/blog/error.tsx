'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold text-[#c1a478] mb-4">Oops!</h1>
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6">
            Something went wrong
          </h2>
          <p className="text-[#5d6d87] text-lg mb-8 leading-relaxed">
            We encountered an error while loading the blog posts. This might be a temporary issue.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={reset}
              className="bg-[#c1a478] hover:bg-[#b09367] text-white px-8 py-4 font-bold text-sm tracking-wider uppercase transition-all duration-300 rounded-sm shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
            
            <Link href="/">
              <motion.button
                className="bg-white border-2 border-[#c1a478] text-[#c1a478] hover:bg-[#c1a478] hover:text-white px-8 py-4 font-bold text-sm tracking-wider uppercase transition-all duration-300 rounded-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go Home
              </motion.button>
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-sm text-left">
              <p className="text-sm text-red-800 font-mono">
                {error.message}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
