'use client';

import { motion } from 'framer-motion';

export default function AboutProperty() {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] font-bold text-[#1a1a1a] leading-[1.1] mb-4 sm:mb-6">
            Creating Opportunities. <br className="hidden sm:block" />Building Your Future.
          </h2>
          <p className="text-[#7C7A70] text-base sm:text-lg leading-relaxed max-w-xl">
            Browse for the perfect place to live by looking through listings, 
            areas, neighborhoods, and insider tips provided by residents. I 
            assist my customers in getting to the heart of their real estate 
            demands, desires, and outcomes. I'm in this for the long term.
          </p>
        </motion.div>

        {/* Right Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <motion.div
            className="border border-[#ece6d9] p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center justify-center text-center aspect-square hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
          >
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#c1a478] mb-2">12+</span>
            <span className="text-[#34465d] text-xs sm:text-sm font-medium tracking-wide">Years of Experience</span>
          </motion.div>

          <motion.div
            className="border border-[#ece6d9] p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center justify-center text-center aspect-square hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
          >
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#c1a478] mb-2">1,500+</span>
            <span className="text-[#34465d] text-xs sm:text-sm font-medium tracking-wide">Satisfied Clients</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
