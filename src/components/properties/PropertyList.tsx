'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { EagleProperty } from '@/lib/eagle-api';
import { buildEagleSlug } from '@/lib/eagle-slug';

const PAGE_SIZE = 12;

function PropertyListInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [allProperties, setAllProperties] = useState<EagleProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = activeSearch
          ? `/api/eagle/properties?search=${encodeURIComponent(activeSearch)}&limit=100`
          : `/api/eagle/properties?limit=100`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch properties');
        }

        setAllProperties(data.properties || []);
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

  const formatPrice = (property: EagleProperty) => {
    if (property.advertisedPrice) return property.advertisedPrice;
    if (property.price) {
      return '$' + property.price.toLocaleString('en-AU', { maximumFractionDigits: 0 });
    }
    return 'Contact for price';
  };

  const getPropertyImage = (property: EagleProperty) => {
    if (property.thumbnailSquare) return property.thumbnailSquare;
    if (property.images && property.images.length > 0) return property.images[0].url;
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800';
  };

  const getPropertyType = (status?: string) => {
    if (!status) return 'FOR SALE';
    return status.toUpperCase().replace(/_/g, ' ');
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
              <div key={i} className="bg-gray-100 animate-pulse h-[360px] sm:h-[380px] rounded" />
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
                  <Link href={`/properties/${buildEagleSlug(property.id, property.formattedAddress)}`} className="block">
                    <div className="relative h-48 sm:h-56 md:h-60 overflow-hidden">
                      <img
                        src={getPropertyImage(property)}
                        alt={property.formattedAddress}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-0 left-0 overflow-hidden w-24 sm:w-28 h-24 sm:h-28 z-10">
                        <div className="absolute top-3 sm:top-4 -left-7 sm:-left-8 w-32 sm:w-36 py-1 text-center text-[9px] sm:text-[10px] font-bold tracking-widest text-white shadow-lg transform -rotate-45 bg-[#5d6d87]">
                          {getPropertyType(property.status)}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-1.5 text-[#c1a478] mb-2">
                      <MapPin size={14} fill="currentColor" fillOpacity={0.2} className="flex-shrink-0" />
                      <span className="text-xs sm:text-[13px] font-medium text-gray-500 truncate">{property.formattedAddress}</span>
                    </div>

                    <Link href={`/properties/${buildEagleSlug(property.id, property.formattedAddress)}`}>
                      <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] mb-3 sm:mb-4 group-hover:text-[#c1a478] transition-colors line-clamp-2 min-h-[3rem]">
                        {property.headline || property.formattedAddress}
                      </h3>
                    </Link>

                    {property.landSize && (
                      <p className="text-xs text-gray-500 mb-3">
                        Land: {property.landSize}{property.landSizeUnits ? ` ${property.landSizeUnits}` : ''}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                      <span className="text-base sm:text-lg font-bold text-[#c1a478]">{formatPrice(property)}</span>
                      <Link
                        href={`/properties/${buildEagleSlug(property.id, property.formattedAddress)}`}
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
            <div key={i} className="bg-gray-100 animate-pulse h-[380px] rounded" />
          ))}
        </div>
      </section>
    }>
      <PropertyListInner />
    </Suspense>
  );
}
