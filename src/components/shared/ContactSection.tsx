'use client';

import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { homeAPI } from '@/lib/api';
import LazyImage from '@/components/shared/LazyImage';
import dynamic from 'next/dynamic';

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

function ContactSection({ settings }: ContactSectionProps) {
  const [dynamicSettings, setDynamicSettings] = useState<any>(null);
  const [loading, setLoading] = useState(!settings);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only fetch if settings are not provided as props
    if (!settings) {
      const fetchSettings = async () => {
        try {
          const data = await homeAPI.getContactSection();
          // The API returns the object directly, not wrapped in results
          if (data && Object.keys(data).length > 0) {
            setDynamicSettings(data);
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

  // Use provided settings, or fetched settings, or return skeleton
  const data = settings || dynamicSettings;

  // Show skeleton during SSR and initial load to prevent hydration mismatch
  if (!isMounted || loading || !data) {
    return (
      <section className="bg-[#FFFAF3] pt-12 sm:pt-16 md:pt-20 pb-0 lg:pb-0 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 lg:gap-0">
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:pr-12 relative z-0 order-2 lg:order-1">
              <div className="max-h-[400px] sm:max-h-[500px] md:max-h-[600px] lg:max-h-[700px] w-64 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="w-full lg:w-1/2 relative lg:static flex justify-center lg:justify-start order-1 lg:order-2">
              <div className="bg-white p-6 sm:p-8 shadow-2xl rounded-sm relative lg:-ml-32 lg:mb-0 z-10 w-full max-w-md lg:max-w-[396px] min-h-[400px] sm:min-h-[430px]">
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-2/3" />
                    <div className="h-6 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="h-12 bg-gray-200 rounded w-full mt-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 to-white pt-12 sm:pt-16 md:pt-20 pb-0 lg:pb-0 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 lg:gap-0">
          
          {/* Left Side: Person Image */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:pr-12 relative z-0 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            key="contact-image"
          >
            <LazyImage 
              src={data.person_image} 
              alt="Real Estate Agent"
              className="max-h-[400px] sm:max-h-[500px] md:max-h-[600px] lg:max-h-[700px] w-auto object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Right Side: Contact Card Overlay */}
          <motion.div 
            className="w-full lg:w-1/2 relative lg:static flex justify-center lg:justify-start order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            key="contact-card"
          >
            <div className="bg-white p-6 sm:p-8 shadow-2xl rounded-xl relative lg:-ml-32 lg:mb-0 z-10 w-full max-w-md lg:max-w-[396px] flex flex-col justify-between min-h-[400px] sm:min-h-[430px] border border-blue-100">
              <div>
                <h2 className="text-2xl sm:text-[28px] leading-[1.2] font-bold text-slate-800 mb-4 sm:mb-6">
                  {data.card_title.split('\n').map((line: string, i: number) => (
                    <span key={i}>
                      {line}
                      {i < data.card_title.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </h2>
                
                <p className="text-slate-600 text-xs sm:text-[13px] font-medium mb-4 sm:mb-6">
                  {data.card_subtitle}
                </p>

                <div className="mb-4 sm:mb-6">
                  <p className="text-sm sm:text-[15px] font-bold text-slate-700">
                    {data.card_description.split('|').map((part: string, i: number) => (
                      <span key={i}>
                        {part.trim()}
                        {i < data.card_description.split('|').length - 1 && (
                          <span className="text-blue-600 mx-2">|</span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <a href={`tel:${data.phone}`} className="flex items-center gap-3 group cursor-pointer min-h-[44px] transition-all duration-200 hover:translate-x-1">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                      <Phone size={16} className="text-blue-600 flex-shrink-0" fill="currentColor" stroke="none" />
                    </div>
                    <span className="text-sm sm:text-[14px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors duration-200">
                      {data.phone}
                    </span>
                  </a>
                  <a href={`mailto:${data.email}`} className="flex items-center gap-3 group cursor-pointer min-h-[44px] transition-all duration-200 hover:translate-x-1">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                      <Mail size={16} className="text-blue-600 flex-shrink-0" />
                    </div>
                    <span className="text-sm sm:text-[14px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors duration-200 break-all">
                      {data.email}
                    </span>
                  </a>
                </div>
              </div>

              <Link href={data.button_link} className="w-full">
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-10 py-3 font-bold text-xs tracking-widest transition-all duration-200 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase w-full min-h-[44px] cursor-pointer">
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

// Export with dynamic import to prevent SSR issues with framer-motion
export default dynamic(() => Promise.resolve(ContactSection), {
  ssr: false,
  loading: () => (
    <section className="bg-[#FFFAF3] pt-12 sm:pt-16 md:pt-20 pb-0 lg:pb-0 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 lg:gap-0">
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:pr-12 relative z-0 order-2 lg:order-1">
            <div className="max-h-[400px] sm:max-h-[500px] md:max-h-[600px] lg:max-h-[700px] w-64 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="w-full lg:w-1/2 relative lg:static flex justify-center lg:justify-start order-1 lg:order-2">
            <div className="bg-white p-6 sm:p-8 shadow-2xl rounded-sm relative lg:-ml-32 lg:mb-0 z-10 w-full max-w-md lg:max-w-[396px] min-h-[400px] sm:min-h-[430px]">
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-2/3" />
                  <div className="h-6 bg-gray-200 rounded w-2/3" />
                </div>
                <div className="h-12 bg-gray-200 rounded w-full mt-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  ),
});
