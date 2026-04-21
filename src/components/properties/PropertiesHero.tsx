'use client';

import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PropertiesHero() {
  return (
    <section className="relative h-[347px] flex items-center justify-center overflow-hidden">
      {/* Fixed Background Image */}
      <div 
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920")',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Properties
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl mb-8 font-medium"
          style={{ color: '#EADEC9' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Find your dream homes with me.
        </motion.p>

        {/* Breadcrumb */}
        <motion.nav 
          className="flex items-center justify-center gap-2 text-white/80 text-sm md:text-base font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <ChevronRight size={16} />
          <span className="text-[#c1a478]">Properties</span>
        </motion.nav>
      </div>
    </section>
  );
}
