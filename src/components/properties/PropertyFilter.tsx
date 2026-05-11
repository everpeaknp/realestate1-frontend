'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { propertiesAPI } from '@/lib/api';


interface PropertyFilterProps {
  onFilterChange?: () => void;
}

export default function PropertyFilter({ onFilterChange }: PropertyFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter state
  const [propertyType, setPropertyType] = useState(searchParams.get('property_type') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [beds, setBeds] = useState(searchParams.get('beds') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  // CMS Settings
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        // data is fetched using the global cmsAPI import

        const data = await propertiesAPI.getHeroSettings();

        if (data) setSettings(data);
      } catch (error) {
        console.error('Error fetching filter settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Mobile collapse state
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync filter state with URL parameters
  useEffect(() => {
    setPropertyType(searchParams.get('property_type') || '');
    setMinPrice(searchParams.get('min_price') || '');
    setMaxPrice(searchParams.get('max_price') || '');
    setBeds(searchParams.get('beds') || '');
    setStatus(searchParams.get('status') || '');
  }, [searchParams]);

  const clearAllFilters = () => {
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setBeds('');
    setStatus('');
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete('property_type');
    params.delete('min_price');
    params.delete('max_price');
    params.delete('beds');
    params.delete('status');
    params.delete('page');
    
    router.push(`/properties?${params.toString()}`, { scroll: false });
    
    if (onFilterChange) {
      onFilterChange();
    }
  };

  const hasActiveFilters = !!(propertyType || minPrice || maxPrice || beds || status);
  const activeFilterCount = [propertyType, minPrice, maxPrice, beds, status].filter(Boolean).length;

  // Shared style tokens for all interactive controls
  const selectClass = "w-full px-2.5 py-2.5 sm:px-3 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 font-medium focus:outline-none focus:border-[#091E34] focus:ring-2 focus:ring-[#091E34]/20 transition-all duration-200 cursor-pointer hover:border-[#091E34]/40 appearance-none";
  const labelClass = "block text-[9px] sm:text-[10px] md:text-xs font-bold text-[#091E34] mb-1.5 sm:mb-2 uppercase tracking-widest whitespace-nowrap";

  if (loading) return null;
  if (settings && !settings.show_filters) return null;

  const filterGrid = (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 items-end">
        {/* Property Type */}
        <div className="w-full">
          <label className={labelClass}>
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => {
              setPropertyType(e.target.value);
              const params = new URLSearchParams(searchParams.toString());
              params.delete('page');
              if (e.target.value) params.set('property_type', e.target.value);
              else params.delete('property_type');
              router.push(`/properties?${params.toString()}`, { scroll: false });
              if (onFilterChange) onFilterChange();
            }}
            className={selectClass}
          >
            <option value="">All Types</option>
            {settings?.property_types?.map((type: any) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className="w-full">
          <label className={labelClass}>
            Min Price
          </label>
          <select
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              const params = new URLSearchParams(searchParams.toString());
              params.delete('page');
              if (e.target.value) params.set('min_price', e.target.value);
              else params.delete('min_price');
              router.push(`/properties?${params.toString()}`, { scroll: false });
              if (onFilterChange) onFilterChange();
            }}
            className={selectClass}
          >
            <option value="">No Min</option>
            {settings?.min_price_options?.map((option: any) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Max Price */}
        <div className="w-full">
          <label className={labelClass}>
            Max Price
          </label>
          <select
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              const params = new URLSearchParams(searchParams.toString());
              params.delete('page');
              if (e.target.value) params.set('max_price', e.target.value);
              else params.delete('max_price');
              router.push(`/properties?${params.toString()}`, { scroll: false });
              if (onFilterChange) onFilterChange();
            }}
            className={selectClass}
          >
            <option value="">No Max</option>
            {settings?.max_price_options?.map((option: any) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div className="w-full">
          <label className={labelClass}>
            Bedrooms
          </label>
          <select
            value={beds}
            onChange={(e) => {
              setBeds(e.target.value);
              const params = new URLSearchParams(searchParams.toString());
              params.delete('page');
              if (e.target.value) params.set('beds', e.target.value);
              else params.delete('beds');
              router.push(`/properties?${params.toString()}`, { scroll: false });
              if (onFilterChange) onFilterChange();
            }}
            className={selectClass}
          >
            <option value="">Any</option>
            {settings?.bedroom_options?.map((option: any) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="w-full">
          <label className={labelClass}>
            Status
          </label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              const params = new URLSearchParams(searchParams.toString());
              params.delete('page');
              if (e.target.value) params.set('status', e.target.value);
              else params.delete('status');
              router.push(`/properties?${params.toString()}`, { scroll: false });
              if (onFilterChange) onFilterChange();
            }}
            className={selectClass}
          >
            <option value="">All Status</option>
            {settings?.status_options?.map((status: any) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {/* Clear All Button */}
        <div className="w-full col-span-2 sm:col-span-1 flex items-end">
          <button
            onClick={clearAllFilters}
            className="w-full px-2.5 py-2.5 sm:px-3 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 font-medium focus:outline-none focus:border-[#091E34] focus:ring-2 focus:ring-[#091E34]/20 transition-all duration-200 cursor-pointer hover:border-[#091E34]/40 hover:bg-[#091E34] hover:text-white whitespace-nowrap"
          >
            Clear All
          </button>
        </div>
      </div>
    </>
  );

  // Helper to get label for active filter badges
  const getLabel = (type: string, value: string) => {
    if (!settings) return value;
    let options: any[] = [];
    switch (type) {
      case 'property_type': options = settings.property_types; break;
      case 'min_price': options = settings.min_price_options; break;
      case 'max_price': options = settings.max_price_options; break;
      case 'beds': options = settings.bedroom_options; break;
      case 'status': options = settings.status_options; break;
    }
    const found = options?.find((o: any) => o.value === value);
    return found ? found.label : value;
  };

  return (
    <div className="w-full">
      {/* Filter Panel */}
      <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl overflow-hidden">

        {/* ── Mobile Toggle Button (visible < md) ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 md:hidden cursor-pointer active:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-[#091E34] uppercase tracking-wider">
            <SlidersHorizontal size={16} />
            {settings?.filter_title || 'Filters'}
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-[#091E34] rounded-full">
                {activeFilterCount}
              </span>
            )}
          </span>
          <ChevronDown
            size={18}
            className={`text-[#091E34] transition-transform duration-300 ${mobileOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* ── Mobile: Collapsible content (< md only) ── */}
        <div
          ref={contentRef}
          className="md:hidden"
          style={{
            maxHeight: mobileOpen ? contentRef.current?.scrollHeight ? `${contentRef.current.scrollHeight}px` : '1000px' : '0px',
            opacity: mobileOpen ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
          }}
        >
          <div className="px-3.5 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2">
            {filterGrid}
          </div>
        </div>

        {/* ── Desktop: Always visible (≥ md) ── */}
        <div className="hidden md:block p-5 lg:p-6">
          {filterGrid}
        </div>
      </div>

      {/* Active Filters Display — always reserves space to prevent layout jump */}
      <div className="mt-3 sm:mt-4 min-h-[36px] sm:min-h-[40px] flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {propertyType && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white/30 text-white rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md border border-white/40 shadow-lg">
            {getLabel('property_type', propertyType)}
            <button onClick={() => {
              setPropertyType('');
              const params = new URLSearchParams(searchParams.toString());
              params.delete('property_type');
              params.delete('page');
              router.push(`/properties?${params.toString()}`, { scroll: false });
              if (onFilterChange) onFilterChange();
            }} className="ml-0.5 hover:text-white/60 transition-colors cursor-pointer">
              <X size={10} />
            </button>
          </span>
        )}
        {minPrice && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white/30 text-white rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md border border-white/40 shadow-lg">
            Min: {getLabel('min_price', minPrice)}
            <button onClick={() => {
              setMinPrice('');
              const params = new URLSearchParams(searchParams.toString());
              params.delete('min_price');
              params.delete('page');
              router.push(`/properties?${params.toString()}`, { scroll: false });
              if (onFilterChange) onFilterChange();
            }} className="ml-0.5 hover:text-white/60 transition-colors cursor-pointer">
              <X size={10} />
            </button>
          </span>
        )}
        {maxPrice && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white/30 text-white rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md border border-white/40 shadow-lg">
            Max: {getLabel('max_price', maxPrice)}
            <button onClick={() => {
              setMaxPrice('');
              const params = new URLSearchParams(searchParams.toString());
              params.delete('max_price');
              params.delete('page');
              router.push(`/properties?${params.toString()}`, { scroll: false });
              if (onFilterChange) onFilterChange();
            }} className="ml-0.5 hover:text-white/60 transition-colors cursor-pointer">
              <X size={10} />
            </button>
          </span>
        )}
        {beds && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white/30 text-white rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md border border-white/40 shadow-lg">
            {getLabel('beds', beds)} Beds
            <button onClick={() => {
              setBeds('');
              const params = new URLSearchParams(searchParams.toString());
              params.delete('beds');
              params.delete('page');
              router.push(`/properties?${params.toString()}`, { scroll: false });
              if (onFilterChange) onFilterChange();
            }} className="ml-0.5 hover:text-white/60 transition-colors cursor-pointer">
              <X size={10} />
            </button>
          </span>
        )}
        {status && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white/30 text-white rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md border border-white/40 shadow-lg">
            {getLabel('status', status)}
            <button onClick={() => {
              setStatus('');
              const params = new URLSearchParams(searchParams.toString());
              params.delete('status');
              params.delete('page');
              router.push(`/properties?${params.toString()}`, { scroll: false });
              if (onFilterChange) onFilterChange();
            }} className="ml-0.5 hover:text-white/60 transition-colors cursor-pointer">
              <X size={10} />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
