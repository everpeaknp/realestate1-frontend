'use client';

import { MapPin, Bed, Bath, Car, Maximize, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';

interface Property {
  id: number;
  slug: string;
  title: string;
  description: string;
  location: string;
  price: string;
  main_image: string | null;
  property_type: string;
  status: string;
  beds: number;
  baths: number;
  garage: number;
  sqft: number;
  is_featured: boolean;
}

function StatusRibbon({ status }: { status: string }) {
  return (
    <div className="absolute top-4 left-[-35px] z-10 w-[140px] h-8 bg-[#5d6d87]/90 flex items-center justify-center -rotate-45 shadow-md">
      <span className="text-white text-[10px] font-bold tracking-widest">{status}</span>
    </div>
  );
}

function formatPrice(price: string): string {
  const numPrice = parseFloat(price);
  return `$${numPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function getImageUrl(imageUrl: string | null): string {
  if (!imageUrl) {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000';
  }
  
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${API_URL}${imageUrl}`;
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedProperties() {
      try {
        const response = await fetch(API_ENDPOINTS.properties.featured);
        if (!response.ok) {
          throw new Error('Failed to fetch featured properties');
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setProperties(data);
        } else if (data.results && Array.isArray(data.results)) {
          setProperties(data.results);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setError('Failed to load featured properties');
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProperties();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 px-2 sm:px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4 sm:mb-6">Featured Properties</h2>
            <p className="text-[#7C7A70] max-w-3xl mx-auto text-base sm:text-lg leading-relaxed font-medium">
              Loading featured properties...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error || properties.length === 0) {
    return (
      <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 px-2 sm:px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4 sm:mb-6">Featured Properties</h2>
            <p className="text-[#7C7A70] max-w-3xl mx-auto text-base sm:text-lg leading-relaxed font-medium">
              {error || 'No featured properties available at the moment.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const mainProperty = properties[0];
  // Ensure exactly 3 side properties so they fit the visual layout
  const sideProperties = properties.slice(1, 4);

  return (
    <section className="bg-white py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 px-2 sm:px-4">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4 sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Featured Properties
          </motion.h2>
          <motion.p 
            className="text-[#7C7A70] max-w-3xl mx-auto text-base sm:text-lg leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Look no further than the highlighted, magnificent home for your next stay. The 
            surrounding area is charming, sophisticated, and visually stunning.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Main Large Card */}
          <motion.div 
            className="lg:col-span-7 bg-[#FFFAF3] shadow-sm overflow-hidden min-h-[600px] lg:h-[720px] flex flex-col"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[300px] sm:h-[400px] lg:h-[480px] overflow-hidden group shrink-0">
              <StatusRibbon status={mainProperty.property_type.replace('_', ' ')} />
              <img 
                src={getImageUrl(mainProperty.main_image)} 
                alt={mainProperty.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Stats Overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-[#34465d]/90 py-3 sm:py-4 px-4 sm:px-8 flex items-center justify-center gap-6 sm:gap-10 text-white text-xs sm:text-sm font-semibold">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Bed size={16} className="opacity-70 sm:w-[18px] sm:h-[18px]" />
                  <span>{mainProperty.beds}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Bath size={16} className="opacity-70 sm:w-[18px] sm:h-[18px]" />
                  <span>{mainProperty.baths}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Car size={16} className="opacity-70 sm:w-[18px] sm:h-[18px]" />
                  <span>{mainProperty.garage}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Maximize size={16} className="opacity-70 sm:w-[18px] sm:h-[18px]" />
                  <span>{mainProperty.sqft}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 flex flex-col items-start flex-1 justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#c1a478] mb-2">
                  <MapPin size={14} fill="currentColor" fillOpacity={0.2} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-[14px] font-medium text-[#7C7A70]">{mainProperty.location}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2 sm:mb-3">{mainProperty.title}</h3>
                <p className="text-[#7C7A70] text-sm leading-relaxed mb-3 sm:mb-4 max-w-lg line-clamp-3">
                  {mainProperty.description
                    ? mainProperty.description.replace(/<[^>]*>/g, '').slice(0, 160) + (mainProperty.description.length > 160 ? '...' : '')
                    : ''}
                </p>
              </div>
              
              <div className="flex items-center justify-between w-full border-t border-gray-200 pt-3 sm:pt-4">
                <span className="text-xl sm:text-2xl font-bold text-[#c1a478]">{formatPrice(mainProperty.price)}</span>
                <Link href={`/properties/${mainProperty.slug}`} className="flex items-center gap-1 text-[10px] sm:text-[12px] font-semibold tracking-widest text-[#1a1a1a] hover:text-[#c1a478] transition-colors uppercase underline underline-offset-4">
                  View Details <ChevronRight size={12} className="sm:w-[14px] sm:h-[14px]" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Side List Cards Container - Forced to match height on LG */}
          <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 lg:h-[720px]">
            {sideProperties.map((prop, index) => (
              <motion.div 
                key={prop.id}
                // Changed to flex-1 so it dynamically divides the 720px space
                className="bg-[#FFFAF3] shadow-sm grid grid-cols-1 sm:grid-cols-5 overflow-hidden flex-1 min-h-[400px] sm:min-h-0"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="relative sm:col-span-2 h-[200px] sm:h-full overflow-hidden group">
                  <StatusRibbon status={prop.property_type.replace('_', ' ')} />
                  <img 
                    src={getImageUrl(prop.main_image)} 
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="sm:col-span-3 p-4 sm:p-6 lg:p-6 flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2 text-[#c1a478]">
                    <MapPin size={12} fill="currentColor" fillOpacity={0.2} className="sm:w-[14px] sm:h-[14px]" />
                    <span className="text-[11px] sm:text-[12px] font-medium text-[#7C7A70]">{prop.location}</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-[#1a1a1a] line-clamp-2">{prop.title}</h4>
                  
                  <div className="flex items-center gap-4 sm:gap-5 text-[#7C7A70] text-xs font-semibold py-1">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <Bed size={12} className="opacity-60 sm:w-[14px] sm:h-[14px]" />
                      <span>{prop.beds}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <Bath size={12} className="opacity-60 sm:w-[14px] sm:h-[14px]" />
                      <span>{prop.baths}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <Car size={12} className="opacity-60 sm:w-[14px] sm:h-[14px]" />
                      <span>{prop.garage}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <Maximize size={12} className="opacity-60 sm:w-[14px] sm:h-[14px]" />
                      <span>{prop.sqft}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full mt-auto pt-3 border-t border-gray-100">
                    <span className="text-base sm:text-lg font-bold text-[#c1a478]">{formatPrice(prop.price)}</span>
                    <Link href={`/properties/${prop.slug}`} className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-semibold tracking-widest text-[#1a1a1a] hover:text-[#c1a478] transition-colors uppercase underline underline-offset-4">
                      View Details <ChevronRight size={10} className="sm:w-[12px] sm:h-[12px]" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}