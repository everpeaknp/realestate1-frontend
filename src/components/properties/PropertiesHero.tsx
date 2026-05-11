'use client';

import { ChevronRight, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_ENDPOINTS, API_URL, apiRequest } from '@/lib/api';
import { buildEagleSlug } from '@/lib/eagle-slug';
import LazyImage from '@/components/shared/LazyImage';
import PropertyFilter from './PropertyFilter';

interface PropertiesHeroSettings {
  id: number;
  title: string;
  subtitle: string;
  background_image: string | null;
  background_url: string;
  background_image_url: string;
  is_active: boolean;
}

interface PropertyResult {
  id: number;
  slug: string;
  title: string;
  location: string;
  price: string;
  main_image: string | null;
  property_type: string;
}

/** Normalised shape used in the dropdown, sourced from either backend */
interface SearchResult {
  key: string;
  slug: string | null;
  eagleId: string | null;
  title: string;
  location: string;
  price: string;
  image: string | null;
  source: 'local' | 'eagle';
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function PropertiesHeroInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<PropertiesHeroSettings | null>(null);
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);


  const debouncedQuery = useDebounce(query, 300);

  // Fetch hero settings
  useEffect(() => {
    apiRequest<{ results: PropertiesHeroSettings[] }>(API_ENDPOINTS.properties.heroSettings)
      .then((res) => { if (res.results?.length) setSettings(res.results[0]); })
      .catch(() => {});
  }, []);

  // Sync query with URL
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Real-time search — queries both local backend and Eagle API in parallel
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setSearching(true);
      try {
        const encoded = encodeURIComponent(debouncedQuery.trim());

        const [localRes, eagleRes] = await Promise.allSettled([
          fetch(
            `${API_ENDPOINTS.properties.list}?search=${encoded}&page_size=5`,
            { signal: controller.signal }
          ),
          fetch(
            `/api/eagle/properties?search=${encoded}&limit=5`,
            { signal: controller.signal }
          ),
        ]);

        const merged: SearchResult[] = [];

        // Local results
        if (localRes.status === 'fulfilled' && localRes.value.ok) {
          const data = await localRes.value.json();
          const items: PropertyResult[] = (data.results || data || []).slice(0, 5);
          for (const p of items) {
            merged.push({
              key: `local-${p.id}`,
              slug: p.slug,
              eagleId: null,
              title: p.title,
              location: p.location,
              price: `$${parseFloat(p.price).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
              image: p.main_image,
              source: 'local',
            });
          }
        }

        // Eagle results
        if (eagleRes.status === 'fulfilled' && eagleRes.value.ok) {
          const data = await eagleRes.value.json();
          if (data.success && Array.isArray(data.properties)) {
            for (const p of data.properties.slice(0, 5)) {
              // Skip if already represented by a local result with same address
              const addr = (p.formattedAddress || '').toLowerCase();
              const duplicate = merged.some(
                (r) => r.location.toLowerCase() === addr
              );
              if (!duplicate) {
                const rawPrice = p.advertisedPrice || (p.price ? `$${Number(p.price).toLocaleString()}` : '');
                merged.push({
                  key: `eagle-${p.id}`,
                  slug: buildEagleSlug(p.id, p.formattedAddress),
                  eagleId: p.id,
                  title: p.headline || p.formattedAddress || 'Eagle Property',
                  location: p.formattedAddress || '',
                  price: rawPrice,
                  image: p.thumbnailSquare || (p.images?.[0]?.url ?? null),
                  source: 'eagle',
                });
              }
            }
          }
        }

        const top = merged.slice(0, 6);
        setResults(top);
        setOpen(top.length > 0);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setResults([]);
      } finally {
        setSearching(false);
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scrollToList = () => {
    const el = document.getElementById('property-list');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('search', query.trim());
    } else {
      params.delete('search');
    }
    // Reset to page 1 when searching
    params.delete('page');
    router.push(`/properties?${params.toString()}`, { scroll: false });
    // Small delay to let the URL update and list re-render before scrolling
    setTimeout(scrollToList, 150);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('page');
    router.push(`/properties?${params.toString()}`);
  };

  const getImage = (img: string | null): string => {
    if (!img) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200';
    if (img.startsWith('http')) return img;
    return `${API_URL}${img}`;
  };

  const title = settings?.title || 'Properties';
  const subtitle = settings?.subtitle || 'Find your dream homes with me.';
  const backgroundUrl = settings?.background_url ||
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920';

  return (
    <section className="relative min-h-0 sm:min-h-[520px] md:min-h-[580px] lg:min-h-[600px] flex items-center justify-center overflow-hidden py-8 sm:py-10 md:py-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <LazyImage
          src={backgroundUrl}
          alt="Properties Hero Background"
          fallbackSrc="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920"
          className="w-full h-full object-cover"
          skeletonClassName="bg-gray-800"
          threshold={0}
          rootMargin="0px"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-3 sm:px-6 w-full max-w-2xl lg:max-w-4xl mx-auto">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl mb-6 font-medium text-[#EADEC9]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
        {/* Search Bar — Premium Glassmorphic Pill */}
        <motion.div
          ref={wrapperRef}
          className="relative mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <form onSubmit={handleSubmit} className="relative group">
            {/* Outer glow on focus */}
            <div className="absolute -inset-0.5 bg-white/20 rounded-full opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-300" />

            <div className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/60 overflow-hidden transition-all duration-300 group-focus-within:shadow-[0_8px_40px_rgba(9,30,52,0.18)]">
              {/* Search Icon */}
              <div className="pl-4 sm:pl-5 flex-shrink-0 text-gray-400 group-focus-within:text-[#091E34] transition-colors duration-200">
                <Search size={18} strokeWidth={2.5} />
              </div>

              {/* Input */}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
                placeholder="Search suburb, address, or keyword..."
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 px-3 py-3.5 sm:py-4 text-sm sm:text-base font-medium outline-none min-w-0"
              />

              {/* Clear button */}
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 mr-1 cursor-pointer"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 mr-1.5 sm:mr-2 flex items-center justify-center rounded-full text-white transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #091E34, #14324E)' }}
              >
                {searching
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Search size={16} strokeWidth={2.5} />
                }
              </button>
            </div>
          </form>

          {/* Dropdown Results */}
          <AnimatePresence>
            {open && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.15)] z-50 overflow-hidden text-left mt-2 border border-gray-100/80"
              >
                <div className="py-1.5">
                  {results.map((p, i) => (
                    <Link
                      key={p.key}
                      href={p.slug ? `/properties/${p.slug}` : `/properties?search=${encodeURIComponent(p.location)}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 transition-all duration-150 group cursor-pointer hover:bg-[#091E34]/[0.04]"
                    >
                      {/* Thumbnail */}
                      <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 ring-1 ring-gray-200/60">
                        <LazyImage
                          src={getImage(p.image)}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#091E34] transition-colors duration-150">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{p.location}</p>
                      </div>
                      {/* Price + source */}
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                        {p.price && (
                          <span className="text-xs font-bold text-[#091E34]">{p.price}</span>
                        )}
                        {p.source === 'eagle' && (
                          <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Eagle</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                {/* View all */}
                <div className="border-t border-gray-100">
                  <Link
                    href={`/properties?search=${encodeURIComponent(query)}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-bold text-[#091E34] uppercase tracking-wider hover:bg-[#091E34]/[0.04] transition-colors duration-150 cursor-pointer"
                  >
                    View all results
                    <span className="text-[#091E34]/60">→</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center justify-center gap-2 text-white/80 text-xs sm:text-sm font-medium mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={16} className="flex-shrink-0" />
          <span className="text-white font-bold">Properties</span>
        </motion.nav>

        {/* Property Filter - Inside Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <PropertyFilter />
        </motion.div>
      </div>
    </section>
  );
}

export default function PropertiesHero() {
  return (
    <Suspense fallback={
      <section className="relative h-[340px] sm:h-[520px] md:h-[580px] lg:h-[600px] bg-gray-800 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#091E34' }} />
      </section>
    }>
      <PropertiesHeroInner />
    </Suspense>
  );
}
