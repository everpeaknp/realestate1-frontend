'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <p className="text-slate-600 text-base sm:text-lg md:text-xl lg:text-2xl font-bold max-w-3xl mx-auto leading-relaxed px-4">
              {introText}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {cards.map((item) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Phone;
              return (
                <div
                  key={item.id}
                  className="group flex flex-col items-center p-8 sm:p-10 lg:p-12 border-2 border-gray-100 bg-white rounded-lg text-center"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-6 sm:mb-8 rounded-lg" style={{ background: '#091E34' }}>
                    <IconComponent size={24} className="sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] mb-2 sm:mb-3 uppercase text-slate-500">
                    {item.title}
                  </h3>
                  <p className="text-lg sm:text-xl font-bold tracking-tight break-words" style={{ color: '#091E34' }}>
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.p 
            className="text-slate-600 text-base sm:text-lg md:text-xl lg:text-2xl font-bold max-w-3xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {introText}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((item, index) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Phone;
            const delay = 0.1 * (index + 1);
            const isHovered = hoveredCard === item.id;
            
            // Make phone, email, and address clickable
            const isPhone = item.icon === 'phone';
            const isEmail = item.icon === 'email';
            const isAddress = item.icon === 'map';
            
            let href: string | undefined;
            let target: string | undefined;
            
            if (isPhone) {
              href = `tel:${item.value.replace(/\s/g, '')}`;
            } else if (isEmail) {
              href = `mailto:${item.value}`;
            } else if (isAddress) {
              // Create Google Maps search URL
              href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.value)}`;
              target = '_blank';
            }
            
            return (
              <motion.div
                key={item.id}
                className="group flex flex-col items-center p-8 sm:p-10 lg:p-12 border-2 bg-white hover:shadow-xl transition-all duration-300 rounded-lg text-center cursor-pointer"
                style={{
                  borderColor: isHovered ? '#091E34' : '#f3f4f6'
                }}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay }}
              >
                {/* Icon Container */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-6 sm:mb-8 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:scale-110" style={{ background: '#091E34' }}>
                  <IconComponent size={24} className="sm:w-7 sm:h-7 text-white" />
                </div>

                {/* Title */}
                <h3 
                  className="text-xs sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] mb-2 sm:mb-3 uppercase transition-colors"
                  style={{
                    color: isHovered ? '#091E34' : '#64748b'
                  }}
                >
                  {item.title}
                </h3>

                {/* Value */}
                {href ? (
                  <a 
                    href={href}
                    target={target}
                    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="text-lg sm:text-xl font-bold tracking-tight transition-opacity break-words cursor-pointer hover:opacity-80"
                    style={{ color: '#091E34' }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-lg sm:text-xl font-bold tracking-tight break-words" style={{ color: '#091E34' }}>
                    {item.value}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
