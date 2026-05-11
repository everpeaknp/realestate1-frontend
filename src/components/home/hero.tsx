'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search, Home, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { API_ENDPOINTS, API_URL } from '@/lib/api';
import { buildEagleSlug } from '@/lib/eagle-slug';
import LazyImage from '@/components/shared/LazyImage';

interface HeroProps {
  settings?: {
    title: string;
    subtitle: string;
    background_image?: string;
    primary_button_text: string;
    primary_button_link: string;
    secondary_button_text: string;
    secondary_button_link: string;
  };
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

interface BlogResult {
  id: number;
  slug: string;
  title: string;
  author_name: string;
  featured_image: string | null;
}

/** Normalised property shape used in the dropdown */
interface PropertySearchResult {
  key: string;
  slug: string | null;
  eagleId: string | null;
  title: string;
  location: string;
  price: string;
  image: string | null;
  source: 'local' | 'eagle';
}

interface SearchResults {
  properties: PropertySearchResult[];
  blogs: BlogResult[];
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Hero({ settings }: HeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ properties: [], blogs: [] });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => { setMounted(true); }, []);

  // Calculate dropdown position from form element
  const updateDropdownPosition = () => {
    if (formRef.current) {
      const rect = formRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
      });
    }
  };

  // Fetch real-time results
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults({ properties: [], blogs: [] });
      setOpen(false);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setLoading(true);
      try {
        const q = encodeURIComponent(debouncedQuery.trim());
        const [propRes, blogRes, eagleRes] = await Promise.allSettled([
          fetch(`${API_ENDPOINTS.properties.list}?search=${q}&page_size=4`, { signal: controller.signal }),
          fetch(`${API_ENDPOINTS.blog.list}?search=${q}&page_size=4`, { signal: controller.signal }),
          fetch(`/api/eagle/properties?search=${q}&limit=4`, { signal: controller.signal }),
        ]);

        const mergedProperties: PropertySearchResult[] = [];

        // Local properties
        if (propRes.status === 'fulfilled' && propRes.value.ok) {
          const propData = await propRes.value.json();
          const items: PropertyResult[] = (propData.results || propData || []).slice(0, 4);
          for (const p of items) {
            mergedProperties.push({
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

        // Eagle properties
        if (eagleRes.status === 'fulfilled' && eagleRes.value.ok) {
          const eagleData = await eagleRes.value.json();
          if (eagleData.success && Array.isArray(eagleData.properties)) {
            for (const p of eagleData.properties.slice(0, 4)) {
              const addr = (p.formattedAddress || '').toLowerCase();
              const duplicate = mergedProperties.some(
                (r) => r.location.toLowerCase() === addr
              );
              if (!duplicate) {
                const rawPrice = p.advertisedPrice || (p.price ? `$${Number(p.price).toLocaleString()}` : '');
                mergedProperties.push({
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

        // Blog posts
        const blogs: BlogResult[] = [];
        if (blogRes.status === 'fulfilled' && blogRes.value.ok) {
          const blogData = await blogRes.value.json();
          blogs.push(...(blogData.results || blogData || []).slice(0, 4));
        }

        setResults({
          properties: mergedProperties.slice(0, 5),
          blogs,
        });
        updateDropdownPosition();
        setOpen(mergedProperties.length > 0 || blogs.length > 0);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setResults({ properties: [], blogs: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [debouncedQuery]);

  // Close on outside click — but not when clicking inside the portal dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inWrapper = wrapperRef.current?.contains(target);
      const inDropdown = dropdownRef.current?.contains(target);
      if (!inWrapper && !inDropdown) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return;
    const handler = () => updateDropdownPosition();
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [open]);

  // If no settings provided, show loading state
  if (!settings) {
    return (
      <section className="relative min-h-[70vh] sm:min-h-[85vh] md:min-h-screen h-auto md:h-[110vh] w-full overflow-hidden flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  const title = settings.title;
  const subtitle = settings.subtitle;
  const backgroundImage = settings.background_image || 'https://www.realtorpal.hocud.com/wp-content/uploads/Video-Fall-Back.jpg';
  const primaryButtonText = settings.primary_button_text;
  const primaryButtonLink = settings.primary_button_link;
  const secondaryButtonText = settings.secondary_button_text;
  const secondaryButtonLink = settings.secondary_button_link;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/properties?search=${encodeURIComponent(query.trim())}`);
  };

  const clearSearch = () => {
    setQuery('');
    setResults({ properties: [], blogs: [] });
    setOpen(false);
  };

  const getImage = (img: string | null): string => {
    if (!img) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200';
    if (img.startsWith('http')) return img;
    return `${API_URL}${img}`;
  };

  const hasResults = results.properties.length > 0 || results.blogs.length > 0;

  const dropdown = mounted && open && hasResults && typeof document !== 'undefined' ? createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        key="search-dropdown"
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={dropdownStyle}
        ref={dropdownRef}
        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.15)] overflow-hidden text-left max-h-[420px] overflow-y-auto border border-gray-100/80"
      >
        {/* Properties */}
        {results.properties.length > 0 && (
          <div>
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
              <Home size={12} className="text-[#091E34]" />
              <span className="text-[10px] font-bold text-[#091E34] uppercase tracking-widest">Properties</span>
            </div>
            <div className="py-1">
              {results.properties.map((p) => (
                <Link
                  key={p.key}
                  href={p.slug ? `/properties/${p.slug}` : `/properties?search=${encodeURIComponent(p.location)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 transition-all duration-150 group cursor-pointer hover:bg-[#091E34]/[0.04]"
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 ring-1 ring-gray-200/60">
                    <LazyImage
                      src={getImage(p.image)}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#091E34] transition-colors duration-150">{p.title}</p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{p.location}</p>
                  </div>
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
            <div className="border-t border-gray-100">
              <Link href={`/properties?search=${encodeURIComponent(query)}`} onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#091E34] uppercase tracking-wider hover:bg-[#091E34]/[0.04] transition-colors duration-150 cursor-pointer">
                View all properties <span className="text-[#091E34]/60">→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Blog */}
        {results.blogs.length > 0 && (
          <div>
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
              <FileText size={12} className="text-[#091E34]" />
              <span className="text-[10px] font-bold text-[#091E34] uppercase tracking-widest">Blog Posts</span>
            </div>
            <div className="py-1">
              {results.blogs.map((b) => (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 transition-all duration-150 group cursor-pointer hover:bg-[#091E34]/[0.04]"
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 ring-1 ring-gray-200/60">
                    <LazyImage
                      src={getImage(b.featured_image)}
                      alt={b.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#091E34] transition-colors duration-150">{b.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{b.author_name}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-100">
              <Link href={`/blog?search=${encodeURIComponent(query)}`} onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#091E34] uppercase tracking-wider hover:bg-[#091E34]/[0.04] transition-colors duration-150 cursor-pointer">
                View all blog posts <span className="text-[#091E34]/60">→</span>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <section className="relative min-h-[70vh] sm:min-h-[85vh] md:min-h-screen h-auto md:h-[110vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <LazyImage
          src={backgroundImage}
          alt="Hero Background"
          fallbackSrc="https://www.realtorpal.hocud.com/wp-content/uploads/Video-Fall-Back.jpg"
          className="w-full h-full object-cover scale-105 transition-transform duration-1000"
          style={{ filter: 'brightness(0.4)' }}
          skeletonClassName="bg-gray-900"
          threshold={0}
          rootMargin="0px"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 text-center text-white py-12 sm:py-16">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold tracking-tight mb-6 sm:mb-8 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>

        <motion.div
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold max-w-4xl mx-auto leading-snug px-2 sm:px-4 text-[#EADEC9] whitespace-nowrap">
            {subtitle}
          </p>
        </motion.div>

        {/* Search Bar — Premium Glassmorphic Pill */}
        <motion.div
          ref={wrapperRef}
          className="mb-10 sm:mb-14 w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <form ref={formRef} onSubmit={handleSubmit} className="relative group">
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
                onFocus={() => hasResults && setOpen(true)}
                placeholder="Search properties, blog posts..."
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 px-3 py-3.5 sm:py-4 text-sm sm:text-base font-medium outline-none min-w-0"
              />

              {/* Clear button */}
              {query && (
                <button type="button" onClick={clearSearch}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 mr-1 cursor-pointer">
                  <X size={14} strokeWidth={2.5} />
                </button>
              )}

              {/* Submit Button */}
              <button type="submit"
                className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 mr-1.5 sm:mr-2 flex items-center justify-center rounded-full text-white transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #091E34, #14324E)' }}>
                {loading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Search size={16} strokeWidth={2.5} />
                }
              </button>
            </div>
          </form>
        </motion.div>

        {/* Portal dropdown renders here */}
        {dropdown}

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link href={primaryButtonLink} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto text-white px-8 sm:px-10 py-3 sm:py-4 font-bold text-xs sm:text-sm tracking-widest transition-all duration-200 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer hover:opacity-90"
              style={{ backgroundColor: '#091E34' }}>
              {primaryButtonText}
            </button>
          </Link>
          <Link href={secondaryButtonLink} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto group flex items-center justify-center gap-1 text-white font-bold text-xs sm:text-sm tracking-widest border-b-2 border-white hover:border-blue-400 transition-all duration-200 pb-1 cursor-pointer">
              {secondaryButtonText}
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-gray-950/20 to-transparent z-1" />
    </section>
  );
}
