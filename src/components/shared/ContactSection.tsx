'use client';

import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { homeAPI } from '@/lib/api';

interface ContactSectionProps {
  settings?: {
    person_image: string;
    card_title: string;
    card_subtitle: string;
    card_description: string;
    button_text: string;
    button_link: string;
    phone: string;
    email: string;
  };
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [dynamicSettings, setDynamicSettings] = useState<any>(null);
  const [loading, setLoading] = useState(!settings);

  // Default values if settings are not provided
  const defaultSettings = {
    person_image: 'https://www.realtorpal.hocud.com/wp-content/uploads/Realtor-Pal-Main-Agent-pro.png',
    card_title: 'I will help you find the property of your dreams.',
    card_subtitle: 'The only name you need to know for real estate answers:',
    card_description: 'Justin Nelson | Boston Realtor',
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
          console.log('Fetching contact section settings...');
          const data = await homeAPI.getContactSection();
          console.log('Contact section data received:', data);
          // The API returns the object directly, not wrapped in results
          if (data && Object.keys(data).length > 0) {
            console.log('Setting dynamic settings:', data);
            setDynamicSettings(data);
          } else {
            console.log('No data received, using defaults');
          }
        } catch (error) {
          console.error('Error fetching contact section settings:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSettings();
    }
  }, [settings]);

  // Use provided settings, or fetched settings, or defaults
  const data = settings || dynamicSettings || defaultSettings;

  console.log('ContactSection render - settings:', settings, 'dynamicSettings:', dynamicSettings, 'using:', data);

  if (loading) {
    console.log('ContactSection still loading...');
    return null;
  }

  return (
    <section className="bg-[#FFFAF3] pt-12 sm:pt-16 md:pt-20 pb-0 lg:pb-0 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 lg:gap-0">
          
          {/* Left Side: Person Image */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:pr-12 relative z-0 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={data.person_image} 
              alt="Real Estate Agent"
              className="max-h-[400px] sm:max-h-[500px] md:max-h-[600px] lg:max-h-[700px] w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Right Side: Contact Card Overlay */}
          <motion.div 
            className="w-full lg:w-1/2 relative lg:static flex justify-center lg:justify-start order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white p-6 sm:p-8 shadow-2xl rounded-sm relative lg:-ml-32 lg:mb-0 z-10 w-full max-w-md lg:max-w-[396px] flex flex-col justify-between min-h-[400px] sm:min-h-[430px]">
              <div>
                <h2 className="text-2xl sm:text-[28px] leading-[1.2] font-bold text-[#1a1a1a] mb-4 sm:mb-6">
                  {data.card_title.split('\n').map((line: string, i: number) => (
                    <span key={i}>
                      {line}
                      {i < data.card_title.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </h2>
                
                <p className="text-[#5d6d87] text-xs sm:text-[13px] font-medium mb-4 sm:mb-6">
                  {data.card_subtitle}
                </p>

                <div className="mb-4 sm:mb-6">
                  <p className="text-sm sm:text-[15px] font-bold text-[#1a1a1a]">
                    {data.card_description.split('|').map((part: string, i: number) => (
                      <span key={i}>
                        {part.trim()}
                        {i < data.card_description.split('|').length - 1 && (
                          <span className="text-[#c1a478] mx-2">|</span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <a href={`tel:${data.phone}`} className="flex items-center gap-3 group cursor-pointer min-h-[44px]">
                    <Phone size={16} className="text-[#c1a478] flex-shrink-0" fill="currentColor" stroke="none" />
                    <span className="text-sm sm:text-[14px] font-bold text-[#5d6d87] group-hover:text-[#c1a478] transition-colors">
                      {data.phone}
                    </span>
                  </a>
                  <a href={`mailto:${data.email}`} className="flex items-center gap-3 group cursor-pointer min-h-[44px]">
                    <Mail size={16} className="text-[#c1a478] flex-shrink-0" />
                    <span className="text-sm sm:text-[14px] font-bold text-[#5d6d87] group-hover:text-[#c1a478] transition-colors break-all">
                      {data.email}
                    </span>
                  </a>
                </div>
              </div>

              <Link href={data.button_link} className="w-full">
                <button className="bg-[#c1a478] hover:bg-[#64748b] text-white px-6 sm:px-10 py-3 font-bold text-xs tracking-widest transition-all rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase w-full min-h-[44px]">
                  {data.button_text}
                </button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
