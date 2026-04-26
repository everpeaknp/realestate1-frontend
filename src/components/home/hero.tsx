'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search, Home, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { API_ENDPOINTS, API_URL } from '@/lib/api';

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

interface SearchResults {
  properties: PropertyResult[];
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
  const debouncedQuery = useDebounce(query, 300);

  const title = settings?.title || 'Justin Nelson | Boston Realtor';
  const subtitle = settings?.subtitle || 'Help with building and manage investment properties portfolio';
  const backgroundImage = settings?.background_image || 'https://www.realtorpal.hocud.com/wp-content/uploads/Video-Fall-Back.jpg';
  const primaryButtonText = settings?.primary_button_text || 'CONTACT ME';
  const primaryButtonLink = settings?.primary_button_link || '/contact';
  const secondaryButtonText = settings?.secondary_button_text || 'View Listing';
  const secondaryButtonLink = settings?.secondary_button_link || '/properties';

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
    const fetchResults = async () => {
      setLoading(true);
      try {
        const q = encodeURIComponent(debouncedQuery.trim());
        const [propRes, blogRes] = await Promise.all([
          fetch(`${API_ENDPOINTS.properties.list}?search=${q}&page_size=4`),
          fetch(`${API_ENDPOINTS.blog.list}?search=${q}&page_size=4`),
        ]);
        const propData = propRes.ok ? await propRes.json() : { results: [] };
        const blogData = blogRes.ok ? await blogRes.json() : { results: [] };
        setResults({
          properties: (propData.results || propData || []).slice(0, 4),
          blogs: (blogData.results || blogData || []).slice(0, 4),
        });
        updateDropdownPosition();
        setOpen(true);
      } catch {
        setResults({ properties: [], blogs: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const dropdown = mounted && open && hasResults ? createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}
        style={dropdownStyle}
        ref={dropdownRef}
        className="bg-white rounded-sm shadow-2xl overflow-hidden text-left max-h-[420px] overflow-y-auto"
      >
        {/* Properties */}
        {results.properties.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <Home size={12} className="text-[#c1a478]" />
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Properties</span>
            </div>
            {results.properties.map((p) => (
              <Link
                key={p.id}
                href={`/properties/${p.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFFAF3] transition-colors border-b border-gray-50 group"
              >
                <div className="w-12 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={getImage(p.main_image)} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#c1a478] transition-colors">{p.title}</p>
                  <p className="text-xs text-gray-400 truncate">{p.location}</p>
                </div>
                <span className="text-xs font-bold text-[#c1a478] flex-shrink-0">
                  ${parseFloat(p.price).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </Link>
            ))}
            <Link href={`/properties?search=${encodeURIComponent(query)}`} onClick={() => setOpen(false)}
              className="block px-4 py-2 text-xs text-[#c1a478] font-semibold hover:bg-gray-50 text-center">
              View all property results →
            </Link>
          </div>
        )}

        {/* Blog */}
        {results.blogs.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <FileText size={12} className="text-[#5d6d87]" />
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Blog Posts</span>
            </div>
            {results.blogs.map((b) => (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFFAF3] transition-colors border-b border-gray-50 group"
              >
                <div className="w-12 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={getImage(b.featured_image)} alt={b.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#c1a478] transition-colors">{b.title}</p>
                  <p className="text-xs text-gray-400">{b.author_name}</p>
                </div>
              </Link>
            ))}
            <Link href={`/blog?search=${encodeURIComponent(query)}`} onClick={() => setOpen(false)}
              className="block px-4 py-2 text-xs text-[#5d6d87] font-semibold hover:bg-gray-50 text-center">
              View all blog results →
            </Link>
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <section className="relative min-h-[70vh] sm:min-h-[85vh] md:min-h-screen h-auto md:h-[110vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('${backgroundImage}')`, filter: 'brightness(0.4)' }}
      />

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

        {/* Search Bar */}
        <motion.div
          ref={wrapperRef}
          className="mb-10 sm:mb-14 w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <form ref={formRef} onSubmit={handleSubmit} className="flex items-stretch w-full shadow-2xl">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => hasResults && setOpen(true)}
                placeholder="Search properties, blog posts..."
                className="w-full bg-white text-gray-800 placeholder-gray-400 px-5 py-4 text-sm font-medium outline-none rounded-l-sm pr-10"
              />
              {query && (
                <button type="button" onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={15} />
                </button>
              )}
            </div>
            <button type="submit"
              className="bg-[#c1a478] hover:bg-[#a8895f] text-white px-6 py-4 flex items-center gap-2 font-bold text-sm tracking-wider transition-colors rounded-r-sm">
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Search size={18} />
              }
              <span className="hidden sm:inline">SEARCH</span>
            </button>
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
            <button className="w-full sm:w-auto bg-[#c1a478] hover:bg-[#64748b] text-white px-8 sm:px-10 py-3 sm:py-4 font-bold text-xs sm:text-sm tracking-widest transition-all rounded-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              {primaryButtonText}
            </button>
          </Link>
          <Link href={secondaryButtonLink} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto group flex items-center justify-center gap-1 text-white font-bold text-xs sm:text-sm tracking-widest border-b-2 border-white hover:border-[#c1a478] transition-all pb-1">
              {secondaryButtonText}
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-gray-950/20 to-transparent z-1" />
    </section>
  );
}
