'use client';

import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PropertiesHero() {
  return (
    <section className="relative h-[280px] sm:h-[320px] md:h-[347px] flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 text-center px-4 sm:px-6">
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Properties
        </motion.h1>
        
        <motion.p 
          className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 font-medium text-[#EADEC9]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Find your dream homes with me.
        </motion.p>

        {/* Breadcrumb */}
        <motion.nav 
          className="flex items-center justify-center gap-2 text-white/80 text-xs sm:text-sm md:text-base font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={16} className="flex-shrink-0" />
          <span className="text-[#c1a478]">Properties</span>
        </motion.nav>
      </div>
    </section>
  );
}
