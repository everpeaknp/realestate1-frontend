'use client';

import { motion } from 'framer-motion';

export default function ServicesProvideSection() {
  return (
    <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
      {/* Background with Parallax effect */}
      <div 
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1920")',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.span 
          className="block text-[#c1a478] font-bold text-sm md:text-base uppercase tracking-[0.2em] mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Services I Provide
        </motion.span>
        
        <motion.h2 
          className="text-3xl md:text-5xl lg:text-[40px] font-bold text-white leading-tight font-sans"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Appreciated for consistently outperforming client expectations and providing exceptional results.
        </motion.h2>
      </div>
    </section>
  );
}
