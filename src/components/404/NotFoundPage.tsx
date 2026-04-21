'use client';

import { motion } from 'framer-motion';

interface NotFoundProps {
  onBackHome: () => void;
}

export default function NotFoundPage({ onBackHome }: NotFoundProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Fixed Background Image */}
      <div 
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920")',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          404 Error
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-white mb-12 font-medium leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          It seems like you've gotten lost among the properties
        </motion.p>

        <motion.button
          onClick={onBackHome}
          className="bg-[#c1a478] hover:bg-[#5d6d87] text-white px-12 py-5 font-bold text-sm tracking-[0.25em] uppercase transition-all duration-300 rounded-sm shadow-xl transform hover:-translate-y-1 block mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Back to Home Page
        </motion.button>
      </div>
    </section>
  );
}
