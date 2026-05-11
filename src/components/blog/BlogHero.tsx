'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, FileText, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { API_ENDPOINTS, API_URL } from '@/lib/api';
import LazyImage from '@/components/shared/LazyImage';

interface BlogHeroSettings {
  title: string;
  subtitle: string;
  background_url: string;
}

interface BlogResult {
  id: number;
  slug: string;
  title: string;
  author_name: string;
  featured_image: string | null;
  category: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function BlogHeroInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<BlogHeroSettings>({
    title: 'Blog',
    subtitle: '',
    background_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1920',
  });
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [results, setResults] = useState<BlogResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => { setMounted(true); }, []);

  // Fetch hero settings
  useEffect(() => {
    fetch(API_ENDPOINTS.blog.heroSettings)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.results?.length) {
          const h = data.results[0];
          setSettings({
            title: h.title || 'Blog',
            subtitle: h.subtitle || '',
            background_url: h.background_url || settings.background_url,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Sync query with URL
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Calculate dropdown position
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
          `${API_ENDPOINTS.blog.list}?search=${encodeURIComponent(debouncedQuery.trim())}&page_size=5`
        );
        const data = res.ok ? await res.json() : { results: [] };
        const items: BlogResult[] = (data.results || data || []).slice(0, 5);
        setResults(items);
        updateDropdownPosition();
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
      const target = e.target as Node;
      if (!wrapperRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
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
    setOpen(false);
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    router.push(`/blog?${params.toString()}`, { scroll: false });
    setTimeout(() => {
      document.getElementById('blog-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    router.push('/blog');
  };

  const getImage = (img: string | null): string => {
    if (!img) return 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=200';
    if (img.startsWith('http')) return img;
    return `${API_URL}${img}`;
  };

  const dropdown = mounted && open && results.length > 0 && typeof document !== 'undefined' ? createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        key="blog-search-dropdown"
        ref={dropdownRef}
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={dropdownStyle}
        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.15)] overflow-hidden text-left max-h-[360px] overflow-y-auto border border-gray-100/80"
      >
        <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
          <FileText size={12} className="text-[#091E34]" />
          <span className="text-[10px] font-bold text-[#091E34] uppercase tracking-widest">Blog Posts</span>
        </div>
        <div className="py-1">
          {results.map((b) => (
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
              {b.category && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 text-[#091E34] bg-[#091E34]/[0.06] uppercase tracking-wider">{b.category}</span>
              )}
            </Link>
          ))}
        </div>
        <div className="border-t border-gray-100">
          <Link
            href={`/blog?search=${encodeURIComponent(query)}`}
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-bold text-[#091E34] uppercase tracking-wider hover:bg-[#091E34]/[0.04] transition-colors duration-150 cursor-pointer"
          >
            View all results
            <span className="text-[#091E34]/60">→</span>
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <section className="relative h-[340px] sm:h-[380px] md:h-[420px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <LazyImage
          src={settings.background_url}
          alt="Blog Hero Background"
          fallbackSrc="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1920"
          className="w-full h-full object-cover"
          skeletonClassName="bg-gray-800"
          threshold={0}
          rootMargin="0px"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-2xl mx-auto">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {settings.title}
        </motion.h1>

        {settings.subtitle && (
          <motion.p
            className="text-base sm:text-lg text-white/90 mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {settings.subtitle}
          </motion.p>
        )}

        {/* Search Bar — Premium Redesign */}
        <motion.div
          ref={wrapperRef}
          className="relative mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <div className="relative group">
            <div className="relative flex items-center bg-white rounded-full p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white transition-all duration-300 group-focus-within:shadow-[0_20px_60px_rgba(9,30,52,0.15)]">
              <input
                ref={formRef as any}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
                placeholder="Search blog posts..."
                className="flex-1 bg-transparent text-brand-primary placeholder-gray-400 pl-6 py-3.5 text-sm sm:text-base font-medium outline-none min-w-0 border-0 focus:ring-0"
              />

              {query && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-primary hover:bg-gray-100 transition-all mr-2 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}

              <button 
                onClick={handleSubmit}
                className="bg-brand-primary text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shrink-0 cursor-pointer"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Portal dropdown */}
        {dropdown}

        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center justify-center gap-2 text-white/80 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={16} className="flex-shrink-0" />
          <span className="text-white font-bold">Blog</span>
        </motion.nav>
      </div>
    </section>
  );
}

export default function BlogHero() {
  return (
    <Suspense fallback={
      <section className="relative h-[340px] sm:h-[380px] md:h-[420px] bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#091E34', borderTopColor: 'transparent' }} />
      </section>
    }>
      <BlogHeroInner />
    </Suspense>
  );
}
