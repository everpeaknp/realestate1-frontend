'use client';

import { MapPin, Bed, Bath, Car, Maximize, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { API_ENDPOINTS } from '@/lib/api';

// ... (Property interface, formatPrice, and getImageUrl remain exactly the same)

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

function formatPrice(price: string): string {
  const numPrice = parseFloat(price);
  return `$${numPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function getImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${API_URL}${imageUrl}`;
}

export default function FeaturedPropertiesAccordion() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchFeaturedProperties() {
      try {
        const response = await fetch(API_ENDPOINTS.properties.featured);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        // Limit to 4 or 5 properties max for the accordion to look its best
        const fetchedProps = Array.isArray(data) ? data : data.results || [];
        setProperties(fetchedProps.slice(0, 5)); 
      } catch (err) {
        console.error('Error fetching:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedProperties();
  }, []);

  const slideNext = useCallback(() => {
    setActiveIndex((prev) => (prev === properties.length - 1 ? 0 : prev + 1));
  }, [properties.length]);

  useEffect(() => {
    if (isPaused || properties.length <= 1) return;
    const timer = setInterval(slideNext, 5000);
    return () => clearInterval(timer);
  }, [isPaused, properties.length, slideNext]);

  if (loading || properties.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-3">Featured Properties</h2>
          <p className="text-[#7C7A70] text-base sm:text-lg font-medium">
            Explore our handpicked selection of premium real estate.
          </p>
        </div>

        {/* Accordion Container */}
        <div 
          className="flex flex-col lg:flex-row w-full h-[800px] lg:h-[600px] gap-2 lg:gap-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {properties.map((prop, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={prop.id}
                layout
                onClick={() => setActiveIndex(index)}
                className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-[0.32,0.72,0,1] flex ${
                  isActive ? 'flex-[4] lg:flex-[5] shadow-xl' : 'flex-[1] lg:flex-[1] opacity-70 hover:opacity-100'
                }`}
                style={{ originX: 0.5, originY: 0.5 }}
              >
                {/* Background Image */}
                <img 
                  src={getImageUrl(prop.main_image)} 
                  alt={prop.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark overlay for inactive cards */}
                <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${isActive ? 'opacity-20' : 'opacity-40'}`} />

                {/* Inactive State: Vertical Text (Desktop) / Horizontal (Mobile) */}
                <AnimatePresence>
                  {!isActive && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 p-4 flex items-end lg:items-center lg:justify-center"
                    >
                      <h3 className="text-white font-bold text-lg lg:-rotate-90 whitespace-nowrap tracking-wider">
                        {prop.title.slice(0, 20)}...
                      </h3>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active State: Full Content Reveal */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-8 bg-white/95 backdrop-blur-md p-6 lg:p-8 rounded-xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center shadow-2xl"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-[#c1a478] mb-2">
                          <MapPin size={16} fill="currentColor" fillOpacity={0.2} />
                          <span className="text-sm font-bold uppercase tracking-wider">{prop.location}</span>
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-[#1a1a1a] mb-4">{prop.title}</h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-[#4a4a4a] text-sm font-semibold">
                          <div className="flex items-center gap-1.5"><Bed size={16} className="text-[#c1a478]"/> {prop.beds} Beds</div>
                          <div className="flex items-center gap-1.5"><Bath size={16} className="text-[#c1a478]"/> {prop.baths} Baths</div>
                          <div className="flex items-center gap-1.5"><Car size={16} className="text-[#c1a478]"/> {prop.garage} Garage</div>
                          <div className="flex items-center gap-1.5"><Maximize size={16} className="text-[#c1a478]"/> {prop.sqft} SqFt</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start lg:items-end gap-4 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-8 w-full lg:w-auto">
                        <span className="text-3xl font-bold text-[#1a1a1a]">{formatPrice(prop.price)}</span>
                        <Link 
                          href={`/properties/${prop.slug}`} 
                          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#c1a478] transition-colors w-full lg:w-auto justify-center"
                        >
                          View Property <ChevronRight size={14} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}