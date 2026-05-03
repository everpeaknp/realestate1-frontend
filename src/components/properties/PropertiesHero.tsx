'use client';

import { ChevronRight, Search, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_ENDPOINTS, API_URL, apiRequest } from '@/lib/api';

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
  const [results, setResults] = useState<PropertyResult[]>([]);
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

  // Real-time search
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const fetchResults = async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `${API_ENDPOINTS.properties.list}?search=${encodeURIComponent(debouncedQuery.trim())}&page_size=5`
        );
        const data = res.ok ? await res.json() : { results: [] };
        const items: PropertyResult[] = (data.results || data || []).slice(0, 5);
        setResults(items);
        setOpen(items.length > 0);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    };
    fetchResults();
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
                    key={p.id}
                    href={`/properties/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFFAF3] transition-colors border-b border-gray-50 group"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={getImage(p.main_image)}
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
                    {/* Price */}
                    <span className="text-xs font-bold text-[#c1a478] flex-shrink-0">
                      ${parseFloat(p.price).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
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
