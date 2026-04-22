'use client';
import { Check, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  'I will never hurry you through the home-finding process.',
  'I go above and beyond to find off-market and ignored homes.',
  'I provide you the confidence-boosting counsel you need.',
  'I promise maximum care, detail, and devotion.',
];

const galleryImages = [
  'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800',
];

export default function BenefitsSection() {
  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block">
              <h2 className="text-[40px] leading-tight font-bold text-[#1a1a1a] mb-8">
                Benefits of working with me
              </h2>
            </div>
            
            <p className="text-[#7C7A70] text-[17px] leading-relaxed mb-10 max-w-xl">
              My objective is to not only have a good impact on ourselves and our families 
              but also to inspire, encourage, and affect long-term change in everyone we meet.
            </p>

            <ul className="space-y-5 mb-12">
              {benefits.map((benefit, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-4 group"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="mt-1 bg-[#c1a478] rounded-full p-1 flex-shrink-0 shadow-sm shadow-[#c1a478]/30">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[#7C7A70] text-[16px] font-medium leading-normal group-hover:text-[#1a1a1a] transition-colors">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="inline-flex flex-col gap-10" style={{ width: '560px' }}>
              <button className="bg-[#c1a478] hover:bg-[#64748b] text-white px-14 py-4 font-bold text-sm tracking-widest transition-all rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase w-full">
                Contact Me
              </button>

              <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-2 group cursor-pointer">
                <Phone size={18} className="text-[#c1a478]" fill="currentColor" stroke="none" />
                <span className="text-lg font-bold text-[#34465d] group-hover:text-[#c1a478] transition-colors">
                  +1 (321) 456 7890
                </span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <Mail size={18} className="text-[#c1a478]" />
                <span className="text-lg font-bold text-[#34465d] group-hover:text-[#c1a478] transition-colors">
                  hello@example.com
                </span>
              </div>
            </div>
            </div>
          </motion.div>

          {/* Right Column: Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                className="relative aspect-square overflow-hidden rounded-sm group shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <img 
                  src={img} 
                  alt={`Real Estate Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
