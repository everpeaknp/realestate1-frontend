'use client';

import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { homeAPI } from '@/lib/api';

interface PersonSectionProps {
  settings?: {
    title: string;
    description: string;
    person_image: string;
    button_text: string;
    button_link: string;
    phone: string;
    email: string;
  };
}

export default function PersonSection({ settings }: PersonSectionProps) {
  const [dynamicSettings, setDynamicSettings] = useState<any>(null);
  const [loading, setLoading] = useState(!settings);

  // Default values if settings are not provided
  const defaultSettings = {
    title: 'I will help you in every way possible to locate your next residence.',
    description: 'Since 2010, I have assisted over 1500 customers in saving over $85 million on their real estate transactions. I provide customers with a personalized experience for selling, purchasing, and renting properties, as well as assistance in obtaining a home loan, with complete transparency and flawless service.',
    person_image: 'https://www.realtorpal.hocud.com/wp-content/uploads/Realtor-Pal-Main-Agent-pro.png',
    button_text: 'Contact Me',
    button_link: '/contact',
    phone: '+1 (321) 456 7890',
    email: 'hello@example.com'
  };

  useEffect(() => {
    // Only fetch if settings are not provided as props
    if (!settings) {
      const fetchSettings = async () => {
        try {
          console.log('Fetching person section settings...');
          const data = await homeAPI.getPersonSection();
          console.log('Person section data received:', data);
          // The API returns the object directly, not wrapped in results
          if (data && Object.keys(data).length > 0) {
            console.log('Setting dynamic settings:', data);
            setDynamicSettings(data);
          } else {
            console.log('No data received, using defaults');
          }
        } catch (error) {
          console.error('Error fetching person section settings:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSettings();
    }
  }, [settings]);

  // Use provided settings, or fetched settings, or defaults
  const data = settings || dynamicSettings || defaultSettings;

  console.log('PersonSection render - settings:', settings, 'dynamicSettings:', dynamicSettings, 'using:', data);

  if (loading) {
    console.log('PersonSection still loading...');
    return null;
  }

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 lg:pb-0 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12">
          {/* Left Column: Content */}
          <motion.div 
            className="z-10 w-full lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-[42px] leading-tight font-bold text-[#1a1a1a] mb-6 sm:mb-8">
              {data.title}
            </h2>
            
            <p className="text-[#7C7A70] text-base sm:text-[17px] leading-relaxed mb-8 sm:mb-12 text-justify">
              {data.description}
            </p>

            <div className="mb-8 sm:mb-12">
              <Link href={data.button_link} className="block w-full sm:w-auto">
                <button className="bg-[#c1a478] hover:bg-[#b09367] text-white px-8 sm:px-12 py-3 sm:py-4 font-bold text-sm tracking-widest transition-all rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase w-full sm:w-auto min-h-[44px]">
                  {data.button_text}
                </button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <a href={`tel:${data.phone}`} className="flex items-center gap-2 group cursor-pointer min-h-[44px]">
                <Phone size={18} className="text-[#c1a478] flex-shrink-0" fill="currentColor" stroke="none" />
                <span className="text-base sm:text-lg font-bold text-[#34465d] group-hover:text-[#c1a478] transition-colors">
                  {data.phone}
                </span>
              </a>
              <a href={`mailto:${data.email}`} className="flex items-center gap-2 group cursor-pointer min-h-[44px]">
                <Mail size={18} className="text-[#c1a478] flex-shrink-0" />
                <span className="text-base sm:text-lg font-bold text-[#34465d] group-hover:text-[#c1a478] transition-colors break-all">
                  {data.email}
                </span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Person Image */}
          <motion.div 
            className="relative flex justify-center items-end w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md lg:max-w-none h-[400px] sm:h-[500px] md:h-[602px]">
              <img 
                src={data.person_image} 
                alt="Real Estate Agent"
                className="w-full h-full object-contain object-bottom"
                referrerPolicy="no-referrer"
              />
              {/* Optional: Subtle backdrop element to mimic the screenshot's depth */}
              <div className="absolute -bottom-6 -left-6 -z-10 w-48 h-48 sm:w-64 sm:h-64 bg-gray-50 rounded-full blur-3xl opacity-50" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
