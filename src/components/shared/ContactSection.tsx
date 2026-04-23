'use client';

import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  return (
    <section className="bg-[#FFFAF3] pb-0 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative">
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-0">
          
          {/* Left Side: Person Image */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center lg:justify-end pr-0 lg:pr-12 relative z-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="/person.png" 
              alt="Justin Nelson"
              className="max-h-[700px] w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Right Side: Contact Card Overlay */}
          <motion.div 
            className="w-full lg:w-1/2 relative lg:static flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white p-8 shadow-2xl rounded-sm relative lg:-ml-32 lg:mb-0 z-10 w-[396px] h-[430px] flex flex-col justify-between">
              <div>
                <h2 className="text-[28px] leading-[1.2] font-bold text-[#1a1a1a] mb-6">
                  I will help you<br />
                  find the property<br />
                  of your dreams.
                </h2>
                
                <p className="text-[#5d6d87] text-[13px] font-medium mb-6">
                  The only name you need to know for real estate answers:
                </p>

                <div className="mb-6">
                  <p className="text-[15px] font-bold text-[#1a1a1a]">
                    Bijen khadka<span className="text-[#c1a478] mx-2">|</span> Investment property specialist

                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <Phone size={16} className="text-[#c1a478]" fill="currentColor" stroke="none" />
                    <span className="text-[14px] font-bold text-[#5d6d87] group-hover:text-[#c1a478] transition-colors">
                      0414701721
                    </span>
                  </div>
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <Mail size={16} className="text-[#c1a478]" />
                    <span className="text-[14px] font-bold text-[#5d6d87] group-hover:text-[#c1a478] transition-colors">
                      bijen@lilywhiterealestate.com.au
                    </span>
                  </div>
                </div>
              </div>

              <button className="bg-[#c1a478] hover:bg-[#64748b] text-white px-10 py-3 font-bold text-xs tracking-widest transition-all rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase w-full">
                Contact Me
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
