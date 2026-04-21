'use client';

import { motion } from 'framer-motion';

export default function AboutProperty() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#1a1a1a] leading-[1.1] mb-6 font-sans">
            Creating Opportunities. <br className="hidden md:block" />Building Your Future.
          </h2>
          <p className="text-[#7C7A70] text-lg leading-relaxed max-w-xl font-sans">
            Browse for the perfect place to live by looking through listings, 
            areas, neighborhoods, and insider tips provided by residents. I 
            assist my customers in getting to the heart of their real estate 
            demands, desires, and outcomes. I'm in this for the long term.
          </p>
        </motion.div>

        {/* Right Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            className="border border-[#ece6d9] p-12 flex flex-col items-center justify-center text-center aspect-square"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
          >
            <span className="text-[48px] font-bold text-[#c1a478] mb-2 font-sans">12+</span>
            <span className="text-[#34465d] text-sm font-medium tracking-wide font-sans">Years of Experience</span>
          </motion.div>

          <motion.div
            className="border border-[#ece6d9] p-12 flex flex-col items-center justify-center text-center aspect-square"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
          >
            <span className="text-[48px] font-bold text-[#c1a478] mb-2 font-sans">1,500+</span>
            <span className="text-[#34465d] text-sm font-medium tracking-wide font-sans">Satisfied Clients</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
