'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Bed, Bath, Car, Maximize, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '@/lib/api';

interface Property {
  id: number;
  slug: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  garage: number;
  sqft: number;
  main_image: string | null;
  property_type: 'FOR_SALE' | 'FOR_RENT';
  status: string;
  is_featured: boolean;
}

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.properties.list);
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();
      
      // Handle both paginated and non-paginated responses
      if (Array.isArray(data)) {
        setProperties(data);
      } else if (data.results && Array.isArray(data.results)) {
        setProperties(data.results);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return `$${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const getPropertyImage = (image: string | null) => {
    if (image && image.startsWith('http')) return image;
    if (image) return `${process.env.NEXT_PUBLIC_API_URL}${image}`;
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800';
  };

  if (loading) {
    return (
      <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-[400px] sm:h-[420px] rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-red-600 text-sm sm:text-base">Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3 sm:mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Available Properties
          </motion.h2>
          <motion.p 
            className="text-[#7C7A70] text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Browse through our carefully curated selection of properties
          </motion.p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              className="bg-[#FFFAF3] border border-gray-100 shadow-sm overflow-hidden group flex flex-col hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              {/* Image Section */}
              <Link href={`/properties/${property.slug}`} className="block">
                <div className="relative h-48 sm:h-56 md:h-60 overflow-hidden">
                  <img
                    src={getPropertyImage(property.main_image)}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Status Ribbon */}
                  <div className="absolute top-0 left-0 overflow-hidden w-24 sm:w-28 h-24 sm:h-28 z-10">
                     <div className={`absolute top-3 sm:top-4 -left-7 sm:-left-8 w-32 sm:w-36 py-1 text-center text-[9px] sm:text-[10px] font-bold tracking-widest text-white shadow-lg transform -rotate-45 ${
                       property.property_type === 'FOR_SALE' ? 'bg-[#5d6d87]' : 'bg-[#5d6d87]/90'
                     }`}>
                       {property.property_type === 'FOR_SALE' ? 'FOR SALE' : 'FOR RENT'}
                     </div>
                  </div>
                </div>
              </Link>

              {/* Content Section */}
              <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-1.5 text-[#c1a478] mb-2">
                  <MapPin size={14} fill="currentColor" fillOpacity={0.2} className="flex-shrink-0" />
                  <span className="text-xs sm:text-[13px] font-medium text-gray-500 truncate">{property.location}</span>
                </div>
                
                <Link href={`/properties/${property.slug}`}>
                  <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] mb-3 sm:mb-4 group-hover:text-[#c1a478] transition-colors line-clamp-2 min-h-[3rem]">
                    {property.title}
                  </h3>
                </Link>

                {/* Amenities */}
                <div className="grid grid-cols-4 gap-2 mb-4 sm:mb-6 border-t border-gray-100 pt-3 sm:pt-4">
                  <div className="flex flex-col items-center gap-1">
                    <Bed size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-gray-800">{property.beds}</span>
                  </div>
                  <div className="flex-col items-center gap-1">
                    <Bath size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-gray-800">{property.baths}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Car size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-gray-800">{property.garage}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Maximize size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-gray-800">{property.sqft}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                  <span className="text-base sm:text-lg font-bold text-[#c1a478]">{formatPrice(property.price)}</span>
                  <Link 
                    href={`/properties/${property.slug}`} 
                    className="flex items-center gap-1 text-[11px] sm:text-[13px] font-bold text-[#34465d] hover:text-[#c1a478] transition-colors uppercase tracking-wide"
                  >
                    Details
                    <ChevronRight size={14} className="mt-0.5 flex-shrink-0" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Properties Message */}
        {properties.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base sm:text-lg">No properties available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
