'use client';
import { motion } from 'framer-motion';
import { CheckCircle2, Phone, Mail } from 'lucide-react';


export default function RentPropertySection() {
  const points = [
    'Ornare sem lacinia quam venenatis vestibulum.',
    'Morbi leo risus porta vestibulum at eros.',
    'Donec id elit non mi porta gravida at eget metus.',
    'Nulla vitae elit libero, a pharetra augue.'
  ];

  return (
    <section className="bg-white">
      <div className="flex justify-center items-center px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center justify-center max-w-[1280px]">
          {/* Left: Image Box */}
          <motion.div 
            className="relative overflow-hidden w-full lg:w-[640px] h-[700px] flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600" 
              alt="Luxury modern home exterior" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            className="flex flex-col gap-8 w-full lg:w-[580px] h-[700px] flex-shrink-0 justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-4xl font-bold text-[#1a1a1a] mb-6 font-sans">Rent Property</h2>
              <p className="text-[#7C7A70] text-lg leading-relaxed font-sans mb-8">
                Etiam porta sem malesuada magna mollis euismod. Cras justo odio, dapibus 
                ac facilisis in, egestas eget quam. Sed posuere consectetur est at lobortis. 
                Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec 
                ullamcorper nulla non metus auctor fringilla.
              </p>

              {/* List Points */}
              <div className="flex flex-col gap-4 mb-10">
                {points.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#c1a478]" />
                    <span className="text-[#5d6d87] font-medium font-sans">{point}</span>
                  </div>
                ))}
              </div>

              {/* Action Area */}
              <div className="flex flex-col gap-8 max-w-lg">
                <button className="w-full py-4 bg-[#c1a478] text-white font-bold uppercase tracking-widest text-sm hover:bg-slate-600 transition-colors shadow-md">
                  Contact Me
                </button>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
                  <div className="flex items-center gap-3 text-[#5d6d87] group cursor-pointer whitespace-nowrap">
                    <Phone size={18} className="text-[#c1a478]" />
                    <span className="font-bold text-[#1a1a1a] group-hover:text-[#c1a478] transition-colors tracking-tight">
                      +1 (321) 456 7890
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5d6d87] group cursor-pointer whitespace-nowrap">
                    <Mail size={18} className="text-[#c1a478]" />
                    <span className="font-bold text-[#1a1a1a] group-hover:text-[#c1a478] transition-colors tracking-tight">
                      hello@example.com
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
