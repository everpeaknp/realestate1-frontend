'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { EagleProperty } from '@/lib/eagle-api';
import { buildEagleSlug } from '@/lib/eagle-slug';
import LazyImage from '@/components/shared/LazyImage';
import PropertyCardSkeleton from '@/components/shared/PropertyCardSkeleton';

const PAGE_SIZE = 12;

export default function PropertyList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSearch = searchParams?.get('search') || '';
  const currentPage = parseInt(searchParams?.get('page') || '1', 10);

  // Filter parameters from URL
  const propertyType = searchParams?.get('property_type') || '';
  const minPrice = searchParams?.get('min_price') || '';
  const maxPrice = searchParams?.get('max_price') || '';
  const beds = searchParams?.get('beds') || '';
  const status = searchParams?.get('status') || '';

  const [allProperties, setAllProperties] = useState<EagleProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch properties when search term changes
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = activeSearch
          ? `/api/eagle/properties?search=${encodeURIComponent(activeSearch)}&limit=100`
          : `/api/eagle/properties?limit=100`;

        console.log('[PropertyList] Fetching from:', url);
        console.log('[PropertyList] Active search term:', activeSearch);

        const response = await fetch(url);
        const data = await response.json();

        console.log('[PropertyList] API response:', {
          success: data.success,
          count: data.count,
          propertiesLength: data.properties?.length || 0
        });

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch properties');
        }

        setAllProperties(data.properties || []);
      } catch (err) {
        console.error('[PropertyList] Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [activeSearch]);

  // Apply client-side filters - recalculate when URL params change
  const filteredProperties = useMemo(() => {
    const filtered = allProperties.filter((property) => {
      // Property Type filter (HOUSE, APARTMENT, UNIT, TOWNHOUSE, VILLA, LAND)
      if (propertyType) {
        const propType = property.propertyType?.toUpperCase() || '';
        if (propType !== propertyType.toUpperCase()) {
          return false;
        }
      }

      // Price filters
      const propertyPrice = property.price || 0;
      if (minPrice && propertyPrice < parseInt(minPrice, 10)) {
        return false;
      }
      if (maxPrice && propertyPrice > parseInt(maxPrice, 10)) {
        return false;
      }

      // Bedrooms filter (extract from description or headline)
      if (beds) {
        const minBeds = parseInt(beds, 10);
        const text = `${property.headline || ''} ${property.description || ''}`.toLowerCase();
        const bedroomMatch = text.match(/(\d+)\s*(?:bed|bedroom)/i);
        if (bedroomMatch) {
          const propertyBeds = parseInt(bedroomMatch[1], 10);
          if (propertyBeds < minBeds) {
            return false;
          }
        } else {
          // If no bedroom info found, exclude from filtered results
          return false;
        }
      }

      // Status filter (CURRENT, ACTIVE, SOLD, LEASED, PENDING)
      if (status) {
        const propStatus = property.status?.toUpperCase() || '';
        if (propStatus !== status.toUpperCase()) {
          return false;
        }
      }

      return true;
    });

    console.log('[PropertyList] Filtering:', {
      allPropertiesCount: allProperties.length,
      filteredCount: filtered.length,
      activeFilters: { propertyType, minPrice, maxPrice, beds, status, activeSearch }
    });

    return filtered;
  }, [allProperties, propertyType, minPrice, maxPrice, beds, status, activeSearch]);

  // Client-side pagination
  const totalPages = Math.ceil(filteredProperties.length / PAGE_SIZE);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const properties = filteredProperties.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', String(page));
    router.push(`/properties?${params.toString()}`, { scroll: false });
    setTimeout(() => {
      document.getElementById('property-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const hasActiveFilters = !!(propertyType || minPrice || maxPrice || beds || status);

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
          {!loading && (activeSearch || hasActiveFilters) && (
            <div className="mt-3 text-sm text-[#5d6d87]">
              <p className="mb-2">
                {filteredProperties.length} propert{filteredProperties.length === 1 ? 'y' : 'ies'} found
                {allProperties.length !== filteredProperties.length && (
                  <span className="text-gray-400"> (filtered from {allProperties.length})</span>
                )}
              </p>
            </div>
          )}
          {loading && (
            <div className="mt-3 text-sm flex items-center justify-center gap-2" style={{ color: '#091E34' }}>
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#091E34' }} />
              <span>Searching properties...</span>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            <PropertyCardSkeleton count={12} />
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
                  className="bg-white border border-gray-100 shadow-sm overflow-hidden group flex flex-col hover:shadow-xl transition-all duration-300 rounded-xl cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                >
                  <Link href={`/properties/${buildEagleSlug(property.id, property.formattedAddress)}`} className="block">
                    <div className="relative h-48 sm:h-56 md:h-60 overflow-hidden">
                      <LazyImage
                        src={getPropertyImage(property)}
                        alt={property.formattedAddress}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-0 left-0 overflow-hidden w-24 sm:w-28 h-24 sm:h-28 z-10">
                        <div className="absolute top-3 sm:top-4 -left-7 sm:-left-8 w-32 sm:w-36 py-1 text-center text-[9px] sm:text-[10px] font-bold tracking-widest text-white shadow-lg transform -rotate-45" style={{ background: '#091E34' }}>
                          {getPropertyType(property.status)}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-1.5 mb-2" style={{ color: '#091E34' }}>
                      <MapPin size={14} fill="currentColor" fillOpacity={0.2} className="flex-shrink-0" />
                      <span className="text-xs sm:text-[13px] font-medium text-gray-500 truncate">{property.formattedAddress}</span>
                    </div>

                    <Link href={`/properties/${buildEagleSlug(property.id, property.formattedAddress)}`}>
                      <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] mb-3 sm:mb-4 transition-colors duration-200 line-clamp-2 min-h-[3rem] group-hover:text-[#091E34]">
                        {property.headline || property.formattedAddress}
                      </h3>
                    </Link>

                    {property.landSize && (
                      <p className="text-xs text-gray-500 mb-3">
                        Land: {property.landSize}{property.landSizeUnits ? ` ${property.landSizeUnits}` : ''}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                      <span className="text-base sm:text-lg font-bold" style={{ color: '#091E34' }}>{formatPrice(property)}</span>
                      <Link
                        href={`/properties/${buildEagleSlug(property.id, property.formattedAddress)}`}
                        className="flex items-center gap-1 text-[11px] sm:text-[13px] font-bold text-[#34465d] transition-colors duration-200 uppercase tracking-wide cursor-pointer hover:text-[#091E34]"
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
                  className="flex items-center gap-1 text-gray-400 hover:text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 min-h-[44px] px-2 cursor-pointer"
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold text-xs transition-all duration-200 cursor-pointer ${
                        page === safePage
                          ? 'text-white shadow-md'
                          : 'text-[#1a1a1a]'
                      }`}
                      style={page === safePage ? { background: '#091E34' } : {}}
                      onMouseEnter={(e) => {
                        if (page !== safePage) {
                          e.currentTarget.style.color = '#091E34';
                          e.currentTarget.style.backgroundColor = 'rgba(9, 30, 52, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (page !== safePage) {
                          e.currentTarget.style.color = '#1a1a1a';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="flex items-center gap-1 text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 min-h-[44px] px-2 cursor-pointer hover:text-[#091E34]"
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
            <p className="text-gray-500 text-base sm:text-lg mb-4">
              {activeSearch || hasActiveFilters
                ? 'No properties match your search criteria.'
                : 'No properties available at the moment.'}
            </p>
            {(activeSearch || hasActiveFilters) && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
                <Link href="/properties" className="inline-block font-semibold hover:underline text-sm cursor-pointer" style={{ color: '#091E34' }}>
                  View all properties
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
