'use client';
import { Check, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { homeAPI } from '@/lib/api';
import LazyImage from '@/components/shared/LazyImage';

interface BenefitsSectionProps {
  benefits?: any[];
  gallery?: any[];
  section?: any;
}

export default function BenefitsSection({ benefits = [], gallery = [], section }: BenefitsSectionProps) {
  const [dynamicBenefits, setDynamicBenefits] = useState<any[]>([]);
  const [dynamicGallery, setDynamicGallery] = useState<any[]>([]);
  const [dynamicSection, setDynamicSection] = useState<any>(null);
  const [loading, setLoading] = useState(!benefits.length && !gallery.length && !section);

  // No fallback data - return null if no data available

  useEffect(() => {
    // Only fetch if data is not provided as props
    if (!benefits.length && !gallery.length && !section) {
      const fetchData = async () => {
        try {
          console.log('Fetching benefits section data...');
          
          // Fetch all three data sources in parallel
          const [benefitsData, galleryData, sectionData] = await Promise.all([
            homeAPI.getBenefits().catch(err => {
              console.error('Error fetching benefits:', err);
              return [];
            }),
            homeAPI.getBenefitGallery().catch(err => {
              console.error('Error fetching gallery:', err);
              return [];
            }),
            homeAPI.getBenefitsSection().catch(err => {
              console.error('Error fetching section:', err);
              return null;
            })
          ]);

          console.log('Benefits data received:', benefitsData);
          console.log('Gallery data received:', galleryData);
          console.log('Section data received:', sectionData);

          if (benefitsData && benefitsData.length > 0) {
            setDynamicBenefits(benefitsData);
          }
          if (galleryData && galleryData.length > 0) {
            setDynamicGallery(galleryData);
          }
          if (sectionData && Object.keys(sectionData).length > 0) {
            setDynamicSection(sectionData);
          }
        } catch (error) {
          console.error('Error fetching benefits section data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [benefits.length, gallery.length, section]);

  // Use provided data, or fetched data, or return null if no data
  const displayBenefits = benefits.length > 0 ? benefits : dynamicBenefits;
  const displayGallery = gallery.length > 0 ? gallery : dynamicGallery;
  const sectionData = section || dynamicSection;

  console.log('BenefitsSection render - props:', { benefits, gallery, section }, 'dynamic:', { dynamicBenefits, dynamicGallery, dynamicSection }, 'using:', { displayBenefits, displayGallery, sectionData });

  if (loading || !displayBenefits.length || !displayGallery.length || !sectionData) {
    console.log('BenefitsSection still loading or no data...');
    return null;
  }

  const title = sectionData.title;
  const description = sectionData.description;
  const phone = sectionData.phone;
  const email = sectionData.email;

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
          
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block">
              <h2 className="text-3xl sm:text-4xl md:text-[40px] leading-tight font-bold text-[#1a1a1a] mb-6 sm:mb-8">
                {title}
              </h2>
            </div>
            
            <p className="text-[#7C7A70] text-base sm:text-[17px] leading-relaxed mb-8 sm:mb-10">
              {description}
            </p>

            <ul className="space-y-4 sm:space-y-5 mb-8 sm:mb-12">
              {displayBenefits.map((benefit: any, index: number) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-3 sm:gap-4 group"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="mt-1 rounded-full p-1 flex-shrink-0 shadow-sm"
                    style={{ background: '#000000', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)' }}>
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-slate-600 text-sm sm:text-[16px] font-medium leading-normal group-hover:text-slate-800 transition-colors duration-200">
                    {typeof benefit === 'string' ? benefit : benefit.text}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col gap-6 sm:gap-10 w-full">
              <button className="text-white px-8 sm:px-14 py-3 sm:py-4 font-bold text-sm tracking-widest transition-all duration-200 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase w-full min-h-[44px] cursor-pointer hover:opacity-90"
                style={{ background: '#000000' }}>
                Contact Me
              </button>

              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-8">
                <a href={`tel:${phone}`} className="flex items-center gap-2 group cursor-pointer min-h-[44px]">
                  <div className="p-2 rounded-lg transition-colors duration-200"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}>
                    <Phone size={18} className="flex-shrink-0" style={{ color: '#000000' }} fill="currentColor" stroke="none" />
                  </div>
                  <span className="text-base sm:text-lg font-bold text-slate-700 transition-colors duration-200"
                    style={{ color: '#1e293b' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#1e293b'}>
                    {phone}
                  </span>
                </a>
                <a href={`mailto:${email}`} className="flex items-center gap-2 group cursor-pointer min-h-[44px]">
                  <div className="p-2 rounded-lg transition-colors duration-200"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}>
                    <Mail size={18} className="flex-shrink-0" style={{ color: '#000000' }} />
                  </div>
                  <span className="text-base sm:text-lg font-bold text-slate-700 transition-colors duration-200 break-all"
                    style={{ color: '#1e293b' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#1e293b'}>
                    {email}
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Image Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {displayGallery.map((img: any, index: number) => (
              <motion.div
                key={index}
                className="relative aspect-square overflow-hidden rounded-sm group shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <LazyImage 
                  src={typeof img === 'string' ? img : img.image} 
                  alt={typeof img === 'string' ? `Real Estate Gallery ${index + 1}` : (img.alt_text || `Gallery ${index + 1}`)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
