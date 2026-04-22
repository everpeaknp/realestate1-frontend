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
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-96 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              className="bg-white border border-gray-100 shadow-sm overflow-hidden group flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              {/* Image Section */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={getPropertyImage(property.main_image)}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                {/* Status Ribbon */}
                <div className="absolute top-0 left-0 overflow-hidden w-28 h-28 z-10">
                   <div className={`absolute top-4 -left-8 w-36 py-1 text-center text-[10px] font-bold tracking-widest text-white shadow-lg transform -rotate-45 ${
                     property.property_type === 'FOR_SALE' ? 'bg-[#5d6d87]' : 'bg-[#5d6d87]/90'
                   }`}>
                     {property.property_type === 'FOR_SALE' ? 'FOR SALE' : 'FOR RENT'}
                   </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-1.5 text-[#c1a478] mb-2">
                  <MapPin size={14} fill="currentColor" fillOpacity={0.2} />
                  <span className="text-[13px] font-medium text-gray-500">{property.location}</span>
                </div>
                
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4 group-hover:text-[#c1a478] transition-colors font-sans">
                  {property.title}
                </h3>

                {/* Amenities */}
                <div className="grid grid-cols-4 gap-2 mb-6 border-t border-gray-100 pt-4">
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                       <Bed size={16} />
                       <span className="text-xs font-bold text-gray-800">{property.beds}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                       <Bath size={16} />
                       <span className="text-xs font-bold text-gray-800">{property.baths}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                       <Car size={16} />
                       <span className="text-xs font-bold text-gray-800">{property.garage}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                       <Maximize size={16} />
                       <span className="text-xs font-bold text-gray-800">{property.sqft}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-lg font-bold text-[#c1a478]">{formatPrice(property.price)}</span>
                  <Link href={`/properties/${property.slug}`} className="flex items-center gap-1 text-[13px] font-bold text-[#34465d] hover:text-[#c1a478] transition-colors">
                    View Details
                    <ChevronRight size={14} className="mt-0.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
