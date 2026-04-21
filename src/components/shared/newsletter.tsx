'use client';

import { motion } from 'framer-motion';

export default function NewsletterSection() {
  return (
    <section className="bg-[#5d6d87] py-16 md:py-20 w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
          
          {/* Text Content */}
          <motion.div 
            className="text-white text-center lg:text-left flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-[38px] font-bold mb-4">
              Subscribe to my newsletter
            </h2>
            <p className="text-white/80 text-base md:text-lg">
              Get the most recent information on real estate.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form 
            className="w-full max-w-2xl flex flex-col sm:flex-row gap-0 shadow-2xl"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input 
              type="email" 
              placeholder="Email address..." 
              className="flex-1 bg-[#e0e5eb] px-6 py-5 text-[#1a1a1a] placeholder:text-[#5d6d87]/60 outline-none focus:bg-white transition-colors"
              required
            />
            <button 
              type="submit" 
              className="bg-[#c1a478] hover:bg-[#b09367] text-white px-10 py-5 font-bold text-xs tracking-[0.2em] transition-all uppercase whitespace-nowrap"
            >
              Subscribe
            </button>
          </motion.form>

        </div>
      </div>
    </section>
  );
}
