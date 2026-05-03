'use client';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServicesHero() {
  return (
    <section className="relative h-[300px] sm:h-[347px] flex items-center justify-center overflow-hidden">
      {/* Fixed Background Image */}
      <div 
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1920")',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6">
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Services
        </motion.h1>
        
        <motion.p 
          className="text-base sm:text-lg md:text-xl font-bold italic mb-6 sm:mb-8"
          style={{ color: '#EADEC9' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The only realtor you will ever want
        </motion.p>

        {/* Breadcrumb Section */}
        <motion.nav 
          className="flex items-center justify-center gap-2 text-white/80 text-xs sm:text-sm md:text-base font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <ChevronRight size={16} className="flex-shrink-0" />
          <span className="text-[#c1a478] font-bold">Services</span>
        </motion.nav>
      </div>
    </section>
  );
}
