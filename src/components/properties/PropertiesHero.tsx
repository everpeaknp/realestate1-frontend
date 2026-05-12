'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, ChevronDown, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownOption {
  label: string;
  value: any;
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-brand-surface-container rounded-md ${className}`} />
  );
}

function BorderlessSelect({ 
  label, 
  value, 
  options, 
  onChange,
  isLoading = false
}: { 
  label: string; 
  value: any; 
  options: DropdownOption[]; 
  onChange: (val: any) => void;
  isLoading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="relative">
        <label className="block font-sans text-[9px] font-bold tracking-widest uppercase text-brand-outline mb-1">
          {label}
        </label>
        <Skeleton className="h-5 w-24" />
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="block font-sans text-[9px] font-bold tracking-widest uppercase text-brand-outline mb-1">
        {label}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="font-sans text-sm font-medium text-brand-primary cursor-pointer flex items-center gap-1 hover:opacity-70 transition-opacity whitespace-nowrap"
      >
        {options.find(o => String(o.value) === String(value))?.label || value}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-brand-surface-container-low py-3 z-[100] overflow-hidden"
            >
              <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-sm font-sans transition-all flex items-center justify-between ${
                      String(value) === String(option.value) 
                        ? 'bg-brand-surface-container text-brand-primary font-bold' 
                        : 'text-brand-outline hover:bg-brand-surface-container-low hover:text-brand-primary'
                    }`}
                  >
                    {option.label}
                    {String(value) === String(option.value) && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface HeroSettings {
  title: string;
  subtitle: string;
  background_url: string;
  property_types: DropdownOption[];
  min_price_options: DropdownOption[];
  max_price_options: DropdownOption[];
  bedroom_options: DropdownOption[];
  status_options: DropdownOption[];
}

export default function PropertiesHero() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Initialize state from URL params
  const [filters, setFilters] = useState({
    type: searchParams?.get('property_type') || 'All',
    minPrice: parseInt(searchParams?.get('min_price') || '0', 10),
    maxPrice: parseInt(searchParams?.get('max_price') || '50000000', 10),
    beds: searchParams?.get('beds') || 'All',
    status: searchParams?.get('status') || 'All',
    search: searchParams?.get('search') || '',
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoadingSettings(true);
        console.log('[PropertiesHero] Fetching dynamic settings...');
        
        // Use the centralized API helper for consistency
        const { propertiesAPI } = await import('@/lib/api');
        const fetchedSettings = await propertiesAPI.getHeroSettings();
        
          if (fetchedSettings) {
            console.log('[PropertiesHero] Dynamic settings received:', fetchedSettings);
            setSettings(fetchedSettings);
          } else {
          console.warn('[PropertiesHero] No hero settings found in backend');
        }
      } catch (error) {
        console.error('[PropertiesHero] Error fetching settings:', error);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

  // Keep state in sync with URL
  useEffect(() => {
    setFilters({
      type: searchParams?.get('property_type') || 'All',
      minPrice: parseInt(searchParams?.get('min_price') || '0', 10),
      maxPrice: parseInt(searchParams?.get('max_price') || '50000000', 10),
      beds: searchParams?.get('beds') || 'All',
      status: searchParams?.get('status') || 'All',
      search: searchParams?.get('search') || '',
    });
    
    if (searchParams?.get('search')) {
      setIsSearchOpen(true);
    }
  }, [searchParams]);

  // Function to update URL params
  const updateUrl = useCallback((newFilters: typeof filters) => {
    setIsSearching(true);
    const params = new URLSearchParams();
    if (newFilters.type !== 'All') params.set('property_type', newFilters.type);
    if (newFilters.minPrice > 0) params.set('min_price', newFilters.minPrice.toString());
    if (newFilters.maxPrice < 50000000) params.set('max_price', newFilters.maxPrice.toString());
    if (newFilters.beds !== 'All') params.set('beds', newFilters.beds);
    if (newFilters.status !== 'All') params.set('status', newFilters.status);
    if (newFilters.search.trim()) params.set('search', newFilters.search.trim());
    
    // Always reset page to 1 on new filter
    params.set('page', '1');
    
    const query = params.toString();
    const newUrl = `${pathname}${query ? `?${query}` : ''}`;
    router.push(newUrl, { scroll: false });
    
    setTimeout(() => setIsSearching(false), 600);
  }, [pathname, router]);

  const onFilterChange = (key: string, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    if (key !== 'search') {
      updateUrl(updated);
    }
  };

  const onSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateUrl(filters);
  };

  const handleSearchToggle = () => {
    if (!isSearchOpen) {
      setIsSearchOpen(true);
    } else if (filters.search.trim() === '') {
      setIsSearchOpen(false);
    } else {
      updateUrl(filters);
    }
  };

  const clearSearch = () => {
    const updated = { ...filters, search: '' };
    setFilters(updated);
    updateUrl(updated);
    setIsSearchOpen(false);
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      type: 'All',
      minPrice: 0,
      maxPrice: 50000000,
      beds: 'All',
      status: 'All',
      search: '',
    };
    setFilters(defaultFilters);
    updateUrl(defaultFilters);
    setIsSearchOpen(false);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.type !== 'All' ||
      filters.minPrice > 0 ||
      filters.maxPrice < 50000000 ||
      filters.beds !== 'All' ||
      filters.status !== 'All' ||
      filters.search.trim() !== ''
    );
  }, [filters]);

  // Process dynamic options with fallbacks and ensuring "All" is present
  const typeOptions = useMemo(() => {
    const base = settings?.property_types || [];
    if (base.length === 0) {
      return [
        { label: 'All Types', value: 'All' },
        { label: 'House', value: 'House' },
        { label: 'Apartment', value: 'Apartment' },
        { label: 'Villa', value: 'Villa' },
        { label: 'Loft', value: 'Loft' },
      ];
    }
    // Ensure "All" is at the start if not present
    if (!base.some(o => o.value === 'All')) {
      return [{ label: 'All Types', value: 'All' }, ...base];
    }
    return base;
  }, [settings]);
  
  const minPriceOptions = useMemo(() => {
    const base = settings?.min_price_options || [];
    if (base.length === 0) {
      return [
        { label: '$0', value: 0 },
        { label: '$1M', value: 1000000 },
        { label: '$2M', value: 2000000 },
        { label: '$3M', value: 3000000 },
        { label: '$5M', value: 5000000 },
      ];
    }
    if (!base.some(o => Number(o.value) === 0)) {
      return [{ label: '$0', value: 0 }, ...base];
    }
    return base;
  }, [settings]);
  
  const maxPriceOptions = useMemo(() => {
    const base = settings?.max_price_options || [];
    if (base.length === 0) {
      return [
        { label: '$2M', value: 2000000 },
        { label: '$3M', value: 3000000 },
        { label: '$5M', value: 5000000 },
        { label: '$10M', value: 10000000 },
        { label: 'Any Max', value: 50000000 },
      ];
    }
    if (!base.some(o => Number(o.value) === 50000000)) {
      return [...base, { label: 'Any Max', value: 50000000 }];
    }
    return base;
  }, [settings]);
  
  const bedOptions = useMemo(() => {
    const base = settings?.bedroom_options || [];
    if (base.length === 0) {
      return [
        { label: 'All Beds', value: 'All' },
        { label: '2+ Beds', value: '2+' },
        { label: '4+ Beds', value: '4+' },
        { label: '6+ Beds', value: '6+' },
      ];
    }
    if (!base.some(o => o.value === 'All')) {
      return [{ label: 'All Beds', value: 'All' }, ...base];
    }
    return base;
  }, [settings]);
  
  const statusOptions = useMemo(() => {
    const base = settings?.status_options || [];
    if (base.length === 0) {
      return [
        { label: 'All Status', value: 'All' },
        { label: 'For Sale', value: 'For Sale' },
        { label: 'Sold', value: 'Sold' },
        { label: 'Under Offer', value: 'Under Offer' },
      ];
    }
    if (!base.some(o => o.value === 'All')) {
      return [{ label: 'All Status', value: 'All' }, ...base];
    }
    return base;
  }, [settings]);

  return (
    <section 
      className="relative w-full px-5 md:px-10 lg:px-20 pt-10 md:pt-16 mb-12 md:mb-20 z-50"
      style={{ minHeight: settings?.background_url ? '600px' : 'auto' }}
    >
      {/* Background Container with Image & Overlay */}
      {settings?.background_url && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${settings.background_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/90 backdrop-blur-[1px]" />
        </div>
      )}

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-16"
        >
          {isLoadingSettings ? (
            <div className="space-y-6">
              <Skeleton className="h-4 w-40 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-12 md:h-16 w-full max-w-2xl" />
                <Skeleton className="h-12 md:h-16 w-3/4 max-w-xl" />
              </div>
            </div>
          ) : (
            <>
              <span className="font-sans text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-brand-outline mb-4 md:mb-6 block">
                {settings?.title || "EXQUISITE COLLECTIONS"}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-brand-primary max-w-5xl leading-[1.1] tracking-tight">
                {settings?.subtitle ? (
                  settings.subtitle.split('<br/>').map((part, index) => (
                    <span key={index}>
                      {part}
                      {index < settings.subtitle.split('<br/>').length - 1 && <br className="hidden md:block" />}
                    </span>
                  ))
                ) : (
                  <>Curated properties for the <br className="hidden md:block" /> discerning lifestyle.</>
                )}
              </h1>
            </>
          )}
        </motion.div>

        <div className="flex flex-col gap-6 md:gap-8 max-w-7xl">
          {/* Property Type Tabs (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {isLoadingSettings ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-28 rounded-full" />
              ))
            ) : (
              typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange('type', opt.value)}
                  className={`px-6 py-2.5 rounded-full font-sans text-[11px] font-bold tracking-widest uppercase transition-all duration-300 border ${
                    filters.type === opt.value
                      ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                      : 'bg-white/80 text-brand-outline border-brand-surface-container hover:border-brand-primary hover:text-brand-primary'
                  }`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center justify-between bg-white rounded-full px-10 py-5 shadow-sm border border-brand-surface-container-low transition-all hover:shadow-xl h-[90px] group">
            <div className="flex items-center gap-10">
              <div className="flex gap-10">
                <BorderlessSelect 
                  label="MIN PRICE"
                  value={filters.minPrice}
                  options={minPriceOptions}
                  onChange={(val) => onFilterChange('minPrice', val)}
                  isLoading={isLoadingSettings}
                />
                <BorderlessSelect 
                  label="MAX PRICE"
                  value={filters.maxPrice}
                  options={maxPriceOptions}
                  onChange={(val) => onFilterChange('maxPrice', val)}
                  isLoading={isLoadingSettings}
                />
              </div>

              <div className="w-px h-8 bg-brand-surface-container" />

              <BorderlessSelect 
                label="BEDROOMS"
                value={filters.beds}
                options={bedOptions}
                onChange={(val) => onFilterChange('beds', val)}
                isLoading={isLoadingSettings}
              />

              <div className="w-px h-8 bg-brand-surface-container" />

              <BorderlessSelect 
                label="STATUS"
                value={filters.status}
                options={statusOptions}
                onChange={(val) => onFilterChange('status', val)}
                isLoading={isLoadingSettings}
              />

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="ml-6 font-sans text-xs font-medium text-brand-outline hover:text-brand-primary transition-colors underline underline-offset-2"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="relative flex items-center h-full ml-10">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 350, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="absolute right-0 flex items-center bg-brand-surface-container-low rounded-full shadow-inner overflow-hidden mr-16"
                  >
                    <form onSubmit={onSearch} className="w-full flex items-center">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search by address, area or keyword..."
                        className="w-full px-6 py-3 font-sans text-sm focus:outline-none bg-transparent border-none"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                      />
                      {filters.search && (
                        <button 
                          type="button" 
                          onClick={clearSearch}
                          className="p-2 hover:text-brand-primary text-brand-outline transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={handleSearchToggle}
                disabled={isSearching}
                className="bg-brand-primary text-white w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg z-10 disabled:opacity-70 group-hover:shadow-brand-primary/20"
              >
                {isSearching ? <Loader2 size={22} className="animate-spin" /> : <Search size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Filter & Search Bar */}
          <div className="lg:hidden space-y-4">
            <form onSubmit={onSearch} className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => onFilterChange('search', e.target.value)}
                  placeholder="Address, area, keyword..."
                  className="w-full bg-white rounded-full px-6 py-4 shadow-sm border border-brand-surface-container-low font-sans text-sm focus:outline-none"
                />
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary"
                >
                  {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                </button>
              </div>
              <button 
                type="button"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="bg-brand-primary text-white p-4 rounded-full shadow-lg"
              >
                <SlidersHorizontal size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[201] px-8 pt-10 pb-12 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif text-2xl text-brand-primary italic">Refine Search</h3>
                <button 
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-10 h-10 rounded-full bg-brand-surface-container-low flex items-center justify-center text-brand-outline"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8 mb-12">
                <div className="space-y-3">
                  <label className="block font-sans text-[10px] font-bold tracking-widest uppercase text-brand-outline">PROPERTY TYPE</label>
                  <div className="grid grid-cols-2 gap-2">
                    {isLoadingSettings ? (
                      [...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-10 rounded-xl" />
                      ))
                    ) : (
                      typeOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => onFilterChange('type', opt.value)}
                          className={`px-4 py-3 rounded-xl text-xs font-sans transition-all border ${
                            filters.type === opt.value 
                              ? 'bg-brand-primary text-white border-brand-primary shadow-md' 
                              : 'bg-white text-brand-outline border-brand-surface-container hover:border-brand-primary'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block font-sans text-[10px] font-bold tracking-widest uppercase text-brand-outline">PRICE RANGE</label>
                  <div className="flex items-center gap-4">
                    {isLoadingSettings ? (
                      <>
                        <Skeleton className="h-12 flex-1 rounded-xl" />
                        <span className="text-brand-outline font-sans text-xs">to</span>
                        <Skeleton className="h-12 flex-1 rounded-xl" />
                      </>
                    ) : (
                      <>
                        <div className="relative flex-1">
                          <select 
                            value={filters.minPrice}
                            onChange={(e) => onFilterChange('minPrice', parseInt(e.target.value))}
                            className="w-full bg-brand-surface-container-low border-none rounded-xl px-4 py-4 text-sm font-sans focus:ring-1 focus:ring-brand-primary appearance-none outline-none ring-0 border-0"
                          >
                            {minPriceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-outline">
                            <ChevronDown size={14} />
                          </div>
                        </div>
                        <span className="text-brand-outline font-sans text-xs">to</span>
                        <div className="relative flex-1">
                          <select 
                            value={filters.maxPrice}
                            onChange={(e) => onFilterChange('maxPrice', parseInt(e.target.value))}
                            className="w-full bg-brand-surface-container-low border-none rounded-xl px-4 py-4 text-sm font-sans focus:ring-1 focus:ring-brand-primary appearance-none outline-none ring-0 border-0"
                          >
                            {maxPriceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-outline">
                            <ChevronDown size={14} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block font-sans text-[10px] font-bold tracking-widest uppercase text-brand-outline">BEDROOMS</label>
                    <div className="relative">
                      {isLoadingSettings ? (
                        <Skeleton className="h-12 w-full rounded-xl" />
                      ) : (
                        <select 
                          value={filters.beds}
                          onChange={(e) => onFilterChange('beds', e.target.value)}
                          className="w-full bg-brand-surface-container-low border-none rounded-xl px-4 py-4 text-sm font-sans focus:ring-1 focus:ring-brand-primary appearance-none outline-none ring-0 border-0"
                        >
                          {bedOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      )}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-outline">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block font-sans text-[10px] font-bold tracking-widest uppercase text-brand-outline">STATUS</label>
                    <div className="relative">
                      {isLoadingSettings ? (
                        <Skeleton className="h-12 w-full rounded-xl" />
                      ) : (
                        <select 
                          value={filters.status}
                          onChange={(e) => onFilterChange('status', e.target.value)}
                          className="w-full bg-brand-surface-container-low border-none rounded-xl px-4 py-4 text-sm font-sans focus:ring-1 focus:ring-brand-primary appearance-none outline-none ring-0 border-0"
                        >
                          {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      )}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-outline">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full mb-4 py-3 rounded-xl font-sans text-xs font-medium text-brand-outline hover:text-brand-primary transition-colors border border-brand-surface-container hover:border-brand-primary"
                >
                  Clear All Filters
                </button>
              )}

              <button 
                onClick={() => {
                  onSearch();
                  setIsMobileFiltersOpen(false);
                }}
                disabled={isSearching}
                className="w-full bg-brand-primary text-white py-5 rounded-full font-sans text-xs font-bold tracking-widest uppercase shadow-lg active:scale-95 transition-transform disabled:opacity-70"
              >
                {isSearching ? 'SEARCHING...' : 'Apply Filters'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
