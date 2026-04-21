import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen h-[110vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ 
          backgroundImage: `url('https://www.realtorpal.hocud.com/wp-content/uploads/Video-Fall-Back.jpg')`,
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl px-6 text-center text-white">
        {/* Title */}
        <motion.h1 
          className="text-3xl md:text-[48px] font-bold tracking-tight mb-8 leading-tight whitespace-nowrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Justin Nelson <span className="mx-4 text-[#c1a478] font-thin">|</span> Boston Realtor
        </motion.h1>

        {/* Subtitle with Swoop */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-xl md:text-[28px] font-bold max-w-3xl mx-auto leading-snug px-4 text-[#EADEC9]">
            I deliver the very best in all facets of{' '}
            <span className="relative inline-block text-white">
              real estate
              {/* Stylized Swoop Underline - positioned below "real estate" */}
              <span className="absolute -bottom-4 left-0 w-full h-6 pointer-events-none opacity-90">
                <svg viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#c1a478]">
                  <path d="M5 15C60 2 140 2 195 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </span>
            .{' '}
            <br />
            Because you deserve no less.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button className="bg-[#c1a478] hover:bg-[#64748b] text-white px-10 py-4 font-bold text-sm tracking-widest transition-all rounded-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            CONTACT ME
          </button>
          
          <button className="group flex items-center gap-1 text-white font-bold text-sm tracking-widest border-b-2 border-white hover:border-[#c1a478] transition-all pb-1">
            View Listing
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Hero Bottom Gradient Blur */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-950/20 to-transparent z-1" />
    </section>
  );
}
