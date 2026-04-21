'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function AboutHero() {
  return (
    <section className="relative h-[347px] flex items-center justify-center overflow-hidden">
      {/* Fixed Background Image */}
      <div 
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1920")',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
         Contact Me
        </motion.h1>
        
      
      </div>
    </section>
  );
}
