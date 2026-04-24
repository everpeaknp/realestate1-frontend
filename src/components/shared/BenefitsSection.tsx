'use client';
import { Check, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { homeAPI } from '@/lib/api';

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

  // Fallback data
  const defaultBenefits = [
    'I will never hurry you through the home-finding process.',
    'I go above and beyond to find off-market and ignored homes.',
    'I provide you the confidence-boosting counsel you need.',
    'I promise maximum care, detail, and devotion.',
  ];

  const defaultGallery = [
    'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800',
  ];

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

  // Use provided data, or fetched data, or defaults
  const displayBenefits = benefits.length > 0 ? benefits : (dynamicBenefits.length > 0 ? dynamicBenefits : defaultBenefits);
  const displayGallery = gallery.length > 0 ? gallery : (dynamicGallery.length > 0 ? dynamicGallery : defaultGallery);
  const sectionData = section || dynamicSection || {};
  const title = sectionData?.title || 'Benefits of working with me';
  const description = sectionData?.description || 'My objective is to not only have a good impact on ourselves and our families but also to inspire, encourage, and affect long-term change in everyone we meet.';
  const phone = sectionData?.phone || '+1 (321) 456 7890';
  const email = sectionData?.email || 'hello@example.com';

  console.log('BenefitsSection render - props:', { benefits, gallery, section }, 'dynamic:', { dynamicBenefits, dynamicGallery, dynamicSection }, 'using:', { displayBenefits, displayGallery, sectionData });

  if (loading) {
    console.log('BenefitsSection still loading...');
    return null;
  }

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
                  <div className="mt-1 bg-[#c1a478] rounded-full p-1 flex-shrink-0 shadow-sm shadow-[#c1a478]/30">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[#7C7A70] text-sm sm:text-[16px] font-medium leading-normal group-hover:text-[#1a1a1a] transition-colors">
                    {typeof benefit === 'string' ? benefit : benefit.text}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col gap-6 sm:gap-10 w-full">
              <button className="bg-[#c1a478] hover:bg-[#64748b] text-white px-8 sm:px-14 py-3 sm:py-4 font-bold text-sm tracking-widest transition-all rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase w-full min-h-[44px]">
                Contact Me
              </button>

              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-8">
                <a href={`tel:${phone}`} className="flex items-center gap-2 group cursor-pointer min-h-[44px]">
                  <Phone size={18} className="text-[#c1a478] flex-shrink-0" fill="currentColor" stroke="none" />
                  <span className="text-base sm:text-lg font-bold text-[#34465d] group-hover:text-[#c1a478] transition-colors">
                    {phone}
                  </span>
                </a>
                <a href={`mailto:${email}`} className="flex items-center gap-2 group cursor-pointer min-h-[44px]">
                  <Mail size={18} className="text-[#c1a478] flex-shrink-0" />
                  <span className="text-base sm:text-lg font-bold text-[#34465d] group-hover:text-[#c1a478] transition-colors break-all">
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
                <img 
                  src={typeof img === 'string' ? img : img.image} 
                  alt={typeof img === 'string' ? `Real Estate Gallery ${index + 1}` : (img.alt_text || `Gallery ${index + 1}`)}
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
