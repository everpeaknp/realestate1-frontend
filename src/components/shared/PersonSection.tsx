import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PersonSection() {
  return (
    <section className="bg-white pt-24 pb-0 overflow-hidden">
      <div className="mx-auto px-6 flex justify-center">
        <div className="flex items-center gap-12" style={{ maxWidth: '1520px' }}>
          {/* Left Column: Content */}
          <motion.div 
            className="z-10"
            style={{ width: '556px', height: '602px' }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[42px] leading-tight font-bold text-[#1a1a1a] mb-8 max-w-lg">
              I will help you in every way possible to locate your next residence.
            </h2>
            
            <p className="text-[#7C7A70] text-[17px] leading-relaxed mb-12 text-justify max-w-[420px]">
              Since 2010, I have assisted over 1500 customers in saving over $85 million on their real estate transactions. 
              I provide customers with a personalized experience for selling, purchasing, and renting properties, as 
              well as assistance in obtaining a home loan, with complete transparency and flawless service.
            </p>

            <div className="mb-12">
              <button className="bg-[#c1a478] hover:bg-[#b09367] text-white px-12 py-4 font-bold text-sm tracking-widest transition-all rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase w-full max-w-[420px]">
                Contact Me
              </button>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 group cursor-pointer">
                <Phone size={18} className="text-[#c1a478]" fill="currentColor" stroke="none" />
                <span className="text-lg font-bold text-[#34465d] group-hover:text-[#c1a478] transition-colors">
                  0414701721
                </span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <Mail size={18} className="text-[#c1a478]" />
                <span className="text-lg font-bold text-[#34465d] group-hover:text-[#c1a478] transition-colors">
                  bijen@lilywhiterealestate.com.au
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Person Image */}
          <motion.div 
            className="relative flex justify-center items-end"
            style={{ width: '402px', height: '602px' }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full h-full flex items-end justify-center">
              {/* Using a high-quality stock photo of a realtor/business man */}
              <img 
                src="/person.png" 
                alt="Bijen khadka- Investment property specialist
"
                className="w-full h-full object-contain object-bottom"
                referrerPolicy="no-referrer"
              />
              {/* Optional: Subtle backdrop element to mimic the screenshot's depth */}
              <div className="absolute -bottom-6 -left-6 -z-10 w-64 h-64 bg-gray-50 rounded-full blur-3xl opacity-50" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
