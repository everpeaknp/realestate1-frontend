'use client';

import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { homeAPI } from '@/lib/api';
import LazyImage from '@/components/shared/LazyImage';

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

  // No default fallback values - if no data, show loading or nothing

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

  // Use provided settings, or fetched settings, or return null if no data
  const data = settings || dynamicSettings;

  console.log('PersonSection render - settings:', settings, 'dynamicSettings:', dynamicSettings, 'using:', data);

  if (loading || !data) {
    console.log('PersonSection still loading or no data...');
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
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 sm:px-12 py-3 sm:py-4 font-bold text-sm tracking-widest transition-all duration-200 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase w-full sm:w-auto min-h-[44px] cursor-pointer">
                  {data.button_text}
                </button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <a href={`tel:${data.phone}`} className="flex items-center gap-2 group cursor-pointer min-h-[44px]">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                  <Phone size={18} className="text-blue-600 flex-shrink-0" fill="currentColor" stroke="none" />
                </div>
                <span className="text-base sm:text-lg font-bold text-slate-700 group-hover:text-blue-600 transition-colors duration-200">
                  {data.phone}
                </span>
              </a>
              <a href={`mailto:${data.email}`} className="flex items-center gap-2 group cursor-pointer min-h-[44px]">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                  <Mail size={18} className="text-blue-600 flex-shrink-0" />
                </div>
                <span className="text-base sm:text-lg font-bold text-slate-700 group-hover:text-blue-600 transition-colors duration-200 break-all">
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
              <LazyImage 
                src={data.person_image} 
                alt="Real Estate Agent"
                className="w-full h-full object-contain object-bottom"
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
