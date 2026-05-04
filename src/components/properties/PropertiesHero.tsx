'use client';

import { ChevronRight, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_ENDPOINTS, API_URL, apiRequest } from '@/lib/api';
import { buildEagleSlug } from '@/lib/eagle-slug';

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
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    router.push(`/properties?${params.toString()}`, { scroll: false });
    // Small delay to let the URL update and list re-render before scrolling
    setTimeout(scrollToList, 150);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    router.push('/properties');
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
    <section className="relative h-[340px] sm:h-[380px] md:h-[420px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0"
        style={{ backgroundImage: `url("${backgroundUrl}")` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-2xl mx-auto">
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

        {/* Search Bar */}
        <motion.div
          ref={wrapperRef}
          className="relative mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <form onSubmit={handleSubmit} className="flex items-stretch w-full shadow-2xl">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
                placeholder="Search by location, type, price..."
                className="w-full bg-white text-gray-800 placeholder-gray-400 px-5 py-3 text-sm font-medium outline-none rounded-l-sm pr-9"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#c1a478] hover:bg-[#a8895f] text-white px-5 py-3 flex items-center gap-2 font-bold text-sm tracking-wider transition-colors rounded-r-sm"
            >
              {searching
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Search size={17} />
              }
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Dropdown */}
          <AnimatePresence>
            {open && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 bg-white rounded-sm shadow-2xl z-50 overflow-hidden text-left mt-1"
              >
                {results.map((p) => (
                  <Link
                    key={p.key}
                    href={p.slug ? `/properties/${p.slug}` : `/properties?search=${encodeURIComponent(p.location)}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFFAF3] transition-colors border-b border-gray-50 group"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={getImage(p.image)}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#c1a478] transition-colors">
                        {p.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{p.location}</p>
                    </div>
                    {/* Price + source badge */}
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      {p.price && (
                        <span className="text-xs font-bold text-[#c1a478]">{p.price}</span>
                      )}
                      {p.source === 'eagle' && (
                        <span className="text-[10px] text-gray-400 font-medium">Eagle</span>
                      )}
                    </div>
                  </Link>
                ))}
                {/* View all */}
                <Link
                  href={`/properties?search=${encodeURIComponent(query)}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-xs text-[#c1a478] font-semibold hover:bg-gray-50 text-center"
                >
                  View all results for &quot;{query}&quot; →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center justify-center gap-2 text-white/80 text-xs sm:text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={16} className="flex-shrink-0" />
          <span className="text-[#c1a478]">Properties</span>
        </motion.nav>
      </div>
    </section>
  );
}

export default function PropertiesHero() {
  return (
    <Suspense fallback={
      <section className="relative h-[340px] sm:h-[380px] md:h-[420px] bg-gray-800 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c1a478] border-t-transparent rounded-full animate-spin" />
      </section>
    }>
      <PropertiesHeroInner />
    </Suspense>
  );
}
