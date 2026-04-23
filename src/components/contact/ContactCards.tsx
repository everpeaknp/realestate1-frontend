'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin, Mail } from 'lucide-react';

interface ContactCard {
  id: number;
  title: string;
  value: string;
  icon: string;
  order: number;
  is_active: boolean;
}

interface ContactCardsProps {
  cards?: ContactCard[];
  introText?: string;
}

const iconMap = {
  phone: Phone,
  map: MapPin,
  email: Mail,
};

export default function ContactCards({ 
  cards = [
    { id: 1, title: 'CALL ME', value: '+1 (321) 456 7890', icon: 'phone', order: 1, is_active: true },
    { id: 2, title: 'OFFICE ADDRESS', value: '324 King Avenue, Boston, USA', icon: 'map', order: 2, is_active: true },
    { id: 3, title: 'EMAIL ME', value: 'hello@example.com', icon: 'email', order: 3, is_active: true }
  ],
  introText = "If you have any questions about the real estate market, I'd love to chat. Reach out below, and I'll get back to you shortly. I look forward to hearing from you."
}: ContactCardsProps) {
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
            {introText}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((item, index) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Phone;
            const delay = 0.1 * (index + 1);
            
            return (
              <motion.div
                key={item.id}
                className="group flex flex-col items-center p-12 border border-gray-100 bg-white hover:border-[#c1a478] hover:shadow-xl transition-all duration-500 rounded-sm text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay }}
              >
                {/* Icon Container */}
                <div className="w-16 h-16 bg-[#5d6d87] flex items-center justify-center mb-8 rounded-sm transition-colors group-hover:bg-[#c1a478]">
                  <IconComponent size={28} className="text-white" />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
