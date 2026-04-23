'use client';

import { motion } from 'framer-motion';

import { Phone, MapPin, Mail } from 'lucide-react';


export default function ContactCards() {
  const contacts = [
    {
      title: 'CALL ME',
      value: '0414701721',
      icon: Phone,
      delay: 0.1
    },
    {
      title: 'OFFICE ADDRESS',
      value: 'Suite1.07/3 Fordham way, oran park, NSW',
      icon: MapPin,
      delay: 0.2
    },
    {
      title: 'EMAIL ME',
      value: 'bijen@lilywhiterealestate.com.au',
      icon: Mail,
      delay: 0.3
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.p 
            className="text-[#5d6d87] text-xl md:text-2xl font-bold max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            If you have any questions about the real estate market, I'd love to chat. 
            Reach out below, and I'll get back to you shortly. I look forward 
            to hearing from you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contacts.map((item, index) => (
            <motion.div
              key={index}
              className="group flex flex-col items-center p-12 border border-gray-100 bg-white hover:border-[#c1a478] hover:shadow-xl transition-all duration-500 rounded-sm text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: item.delay }}
            >
              {/* Icon Container */}
              <div className="w-16 h-16 bg-[#5d6d87] flex items-center justify-center mb-8 rounded-sm transition-colors group-hover:bg-[#c1a478]">
                <item.icon size={28} className="text-white" />
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-[#5d6d87] tracking-[0.2em] mb-3 uppercase group-hover:text-[#1a1a1a] transition-colors">
                {item.title}
              </h3>

              {/* Value */}
              <p className="text-xl font-bold text-[#c1a478] tracking-tight transition-colors">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
