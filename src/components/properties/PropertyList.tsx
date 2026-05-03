'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Bed, Bath, Car, Maximize, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '@/lib/api';

const PAGE_SIZE = 12;

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

function PropertyListInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = activeSearch
          ? `${API_ENDPOINTS.properties.list}?search=${encodeURIComponent(activeSearch)}&page_size=100`
          : `${API_ENDPOINTS.properties.list}?page_size=100`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        setAllProperties(Array.isArray(data) ? data : (data.results || []));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [activeSearch]);

  // Client-side pagination
  const totalPages = Math.ceil(allProperties.length / PAGE_SIZE);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const properties = allProperties.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/properties?${params.toString()}`, { scroll: false });
    setTimeout(() => {
      document.getElementById('property-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return `${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const getPropertyImage = (image: string | null) => {
    if (image && image.startsWith('http')) return image;
    if (image) return `${process.env.NEXT_PUBLIC_API_URL}${image}`;
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800';
  };

  return (
    <section id="property-list" className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
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
            {activeSearch ? `Results for "${activeSearch}"` : 'Available Properties'}
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
          {activeSearch && (
            <p className="mt-2 text-sm text-[#5d6d87]">
              {allProperties.length} propert{allProperties.length === 1 ? 'y' : 'ies'} found
              <Link href="/properties" className="ml-2 text-[#c1a478] hover:underline">Clear</Link>
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-[400px] sm:h-[420px] rounded" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 text-sm sm:text-base">Error: {error}</p>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && properties.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-12">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  className="bg-[#FFFAF3] border border-gray-100 shadow-sm overflow-hidden group flex flex-col hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                >
                  <Link href={`/properties/${property.slug}`} className="block">
                    <div className="relative h-48 sm:h-56 md:h-60 overflow-hidden">
                      <img
                        src={getPropertyImage(property.main_image)}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-0 left-0 overflow-hidden w-24 sm:w-28 h-24 sm:h-28 z-10">
                        <div className={`absolute top-3 sm:top-4 -left-7 sm:-left-8 w-32 sm:w-36 py-1 text-center text-[9px] sm:text-[10px] font-bold tracking-widest text-white shadow-lg transform -rotate-45 ${
                          property.property_type === 'FOR_SALE' ? 'bg-[#5d6d87]' : 'bg-[#5d6d87]/90'
                        }`}>
                          {property.property_type === 'FOR_SALE' ? 'FOR SALE' : 'FOR RENT'}
                        </div>
                      </div>
                    </div>
                  </Link>

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

                    <div className="grid grid-cols-4 gap-2 mb-4 sm:mb-6 border-t border-gray-100 pt-3 sm:pt-4">
                      <div className="flex flex-col items-center gap-1">
                        <Bed size={16} className="text-slate-400" />
                        <span className="text-xs font-bold text-gray-800">{property.beds}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold tracking-[0.15em] uppercase">
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="flex items-center gap-1 text-gray-400 hover:text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px] px-2"
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-sm font-bold text-xs transition-colors ${
                        page === safePage
                          ? 'bg-[#c1a478] text-white'
                          : 'text-[#1a1a1a] hover:text-[#c1a478]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="flex items-center gap-1 text-[#1a1a1a] hover:text-[#c1a478] disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px] px-2"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}

        {/* No results */}
        {!loading && !error && properties.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-base sm:text-lg">
              {activeSearch ? `No properties found for "${activeSearch}".` : 'No properties available at the moment.'}
            </p>
            {activeSearch && (
              <Link href="/properties" className="mt-3 inline-block text-[#c1a478] font-semibold hover:underline text-sm">
                View all properties
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function PropertyList() {
  return (
    <Suspense fallback={
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-[420px] rounded" />
          ))}
        </div>
      </section>
    }>
      <PropertyListInner />
    </Suspense>
  );
}
