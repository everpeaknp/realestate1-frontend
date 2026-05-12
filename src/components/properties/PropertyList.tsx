'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EagleProperty } from '@/lib/eagle-api';
import { buildEagleSlug } from '@/lib/eagle-slug';
import PropertyCard from './PropertyCard';
import { Property } from './types';
import PropertyCardSkeleton from '@/components/shared/PropertyCardSkeleton';
import { parsePropertyStats } from '@/lib/property-utils';

const ITEMS_PER_PAGE = 12;

export default function PropertyList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Extract all filter parameters from URL
  const activeSearch = searchParams?.get('search') || '';
  const propertyType = searchParams?.get('property_type') || '';
  const minPriceParam = searchParams?.get('min_price') || '0';
  const maxPriceParam = searchParams?.get('max_price') || '50000000';
  const beds = searchParams?.get('beds') || 'All';
  const status = searchParams?.get('status') || 'All';
  const currentPageFromUrl = parseInt(searchParams?.get('page') || '1', 10);

  const [allProperties, setAllProperties] = useState<EagleProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch properties from API whenever search or fundamental API filters change
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build the API URL based on current search parameters
        const apiParams = new URLSearchParams();
        if (activeSearch) apiParams.set('search', activeSearch);
        
        // Map UI status labels to Eagle API status codes for server-side fetching
        if (status && status !== 'All') {
          let apiStatus = status.toUpperCase();
          if (apiStatus === 'FOR SALE') apiStatus = 'CURRENT';
          if (apiStatus === 'UNDER OFFER') apiStatus = 'UNDER_OFFER';
          apiParams.set('status', apiStatus);
        }
        
        if (propertyType && propertyType !== 'All') {
          apiParams.set('propertyType', propertyType.toUpperCase());
        }
        
        apiParams.set('limit', '200');

        const url = `/api/eagle/properties?${apiParams.toString()}`;
        console.log('[PropertyList] Fetching:', url);

        const response = await fetch(url);
        const data = await response.json();

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
  }, [activeSearch, propertyType, status]); // Re-fetch when these core params change

  // Apply granular client-side filters (Price, Bedrooms)
  const filteredProperties = useMemo(() => {
    const minPrice = parseInt(minPriceParam, 10);
    const maxPrice = parseInt(maxPriceParam, 10);

    return allProperties.filter((property) => {
      // Price filters
      const propertyPrice = property.price || 0;
      if (propertyPrice > 0) {
        if (minPrice > 0 && propertyPrice < minPrice) return false;
        if (maxPrice < 50000000 && propertyPrice > maxPrice) return false;
      }

      // Bedrooms filter
      if (beds && beds !== 'All') {
        const minBedsRequired = parseInt(beds.replace('+', ''), 10);
        const { beds: propertyBeds } = parsePropertyStats(property);
        if ((propertyBeds ?? 0) < minBedsRequired) return false;
      }

      return true;
    });
  }, [allProperties, minPriceParam, maxPriceParam, beds]);

  // Map to the editorial Property interface
  const mappedProperties = useMemo(() => {
    return filteredProperties.map((p): Property => {
      const { beds, baths, cars } = parsePropertyStats(p);

      let displayPrice = p.price ? `$${p.price.toLocaleString()}` : 'Contact Agent';
      if (p.advertisedPrice) {
        const cleaned = p.advertisedPrice.split(/\s*[|—–]\s*/)[0].trim();
        if (/[\d$]/.test(cleaned)) displayPrice = cleaned;
      }

      let tag = undefined;
      let tagColor = 'bg-brand-primary';
      const pStatus = p.status?.toUpperCase();

      if (pStatus === 'SOLD') {
        tag = 'SOLD';
        tagColor = 'bg-red-600';
      } else if (pStatus === 'UNDER OFFER' || pStatus === 'UNDER_OFFER') {
        tag = 'UNDER OFFER';
        tagColor = 'bg-amber-600';
      } else if (p.featured) {
        tag = 'FEATURED';
        tagColor = 'bg-brand-primary';
      } else if (pStatus === 'CURRENT') {
        if ((p.headline || '').toLowerCase().includes('just listed')) {
          tag = 'JUST LISTED';
          tagColor = 'bg-emerald-600';
        }
      }

      const title = p.headline || p.formattedAddress.split(',')[0];
      return {
        id: p.id,
        title: title,
        price: displayPrice,
        location: p.formattedAddress,
        beds: beds ?? 0,
        baths: baths ?? 0,
        cars: cars ?? 0,
        image: p.images?.[0]?.url || p.thumbnailSquare || '/images/placeholder-property.jpg',
        tag,
        tagColor,
        slug: buildEagleSlug(p.id, title)
      };
    });
  }, [filteredProperties]);

  // Pagination logic
  const totalPages = Math.ceil(mappedProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPageFromUrl - 1) * ITEMS_PER_PAGE;
  const currentItems = mappedProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && allProperties.length === 0) {
    return (
      <section className="w-full px-5 md:px-10 lg:px-20 mb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {[...Array(8)].map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-serif text-xl">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-brand-primary font-bold border-b border-brand-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="w-full px-5 md:px-10 lg:px-20 mb-32 relative z-10">
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && allProperties.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] flex justify-center items-start pt-20"
          >
            <div className="flex flex-col items-center gap-4 sticky top-40">
              <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
              <p className="font-sans text-[10px] font-bold tracking-widest text-brand-primary uppercase">Searching Collections...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mappedProperties.length === 0 ? (
        <div className="text-center py-40">
          <h3 className="font-serif text-3xl text-brand-primary mb-4 italic">No properties matching your criteria</h3>
          <p className="text-brand-outline font-sans tracking-wide">Refine your search above to explore our exquisite collections.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16 md:gap-y-24 mb-24">
            {currentItems.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6">
              <button
                onClick={() => goToPage(Math.max(1, currentPageFromUrl - 1))}
                disabled={currentPageFromUrl === 1}
                className="p-4 rounded-full border border-brand-surface-container hover:border-brand-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft size={22} className="text-brand-primary" />
              </button>
              
              <div className="flex items-center gap-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-12 h-12 rounded-full font-sans text-xs font-bold transition-all duration-300 ${
                      currentPageFromUrl === page
                        ? 'bg-brand-primary text-white shadow-lg'
                        : 'text-brand-outline hover:text-brand-primary hover:bg-brand-surface-container-low'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(Math.min(totalPages, currentPageFromUrl + 1))}
                disabled={currentPageFromUrl === totalPages}
                className="p-4 rounded-full border border-brand-surface-container hover:border-brand-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronRight size={22} className="text-brand-primary" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
