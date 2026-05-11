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

  const selectClass = "w-full px-2.5 py-2.5 sm:px-3 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 font-medium focus:outline-none focus:border-[#091E34] focus:ring-2 focus:ring-[#091E34]/20 transition-all duration-200 cursor-pointer hover:border-[#091E34]/40 appearance-none";
  const labelClass = "block text-[9px] sm:text-[10px] md:text-xs font-bold text-[#091E34] mb-1.5 sm:mb-2 uppercase tracking-widest whitespace-nowrap";

  if (loading) return null;

  const filterGrid = (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 items-end">
      {/* Property Type */}
      <div className="w-full">
        <label className={labelClass}>Property Type</label>
        <select
          value={propertyType}
          onChange={(e) => {
            setPropertyType(e.target.value);
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) params.set('property_type', e.target.value);
            else params.delete('property_type');
            params.delete('page');
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
        <label className={labelClass}>Min Price</label>
        <select
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) params.set('min_price', e.target.value);
            else params.delete('min_price');
            params.delete('page');
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
        <label className={labelClass}>Max Price</label>
        <select
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) params.set('max_price', e.target.value);
            else params.delete('max_price');
            params.delete('page');
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
        <label className={labelClass}>Bedrooms</label>
        <select
          value={beds}
          onChange={(e) => {
            setBeds(e.target.value);
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) params.set('beds', e.target.value);
            else params.delete('beds');
            params.delete('page');
            router.push(`/properties?${params.toString()}`, { scroll: false });
            if (onFilterChange) onFilterChange();
          }}
          className={selectClass}
        >
          <option value="">Any Beds</option>
          {settings?.bedroom_options?.map((option: any) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="w-full">
        <label className={labelClass}>Status</label>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) params.set('status', e.target.value);
            else params.delete('status');
            params.delete('page');
            router.push(`/properties?${params.toString()}`, { scroll: false });
            if (onFilterChange) onFilterChange();
          }}
          className={selectClass}
        >
          <option value="">All Status</option>
          {settings?.status_options?.map((option: any) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Clear All Button */}
      <div className="w-full col-span-2 lg:col-span-1 flex items-end">
        <button
          onClick={clearAllFilters}
          className="w-full px-2.5 py-2.5 sm:px-3 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 font-medium focus:outline-none focus:border-[#091E34] focus:ring-2 focus:ring-[#091E34]/20 transition-all duration-200 cursor-pointer hover:border-[#091E34]/40 hover:bg-[#091E34] hover:text-white whitespace-nowrap"
        >
          Clear All
        </button>
      </div>
    </div>
  );

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
    const found = options?.find((o: any) => String(o.value) === String(value));
    return found ? found.label : value;
  };

  return (
    <div className="w-full">
      <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl overflow-hidden">
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

        <div
          ref={contentRef}
          className={`${mobileOpen ? 'block' : 'hidden'} md:block`}
        >
          <div className="px-3.5 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2 md:p-5 lg:p-6">
            {filterGrid}
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 min-h-[36px] sm:min-h-[40px] flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {propertyType && (
          <Badge label={getLabel('property_type', propertyType)} onClear={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('property_type');
            router.push(`/properties?${params.toString()}`, { scroll: false });
          }} />
        )}
        {minPrice && (
          <Badge label={`Min: ${getLabel('min_price', minPrice)}`} onClear={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('min_price');
            router.push(`/properties?${params.toString()}`, { scroll: false });
          }} />
        )}
        {maxPrice && (
          <Badge label={`Max: ${getLabel('max_price', maxPrice)}`} onClear={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('max_price');
            router.push(`/properties?${params.toString()}`, { scroll: false });
          }} />
        )}
        {beds && (
          <Badge label={getLabel('beds', beds)} onClear={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('beds');
            router.push(`/properties?${params.toString()}`, { scroll: false });
          }} />
        )}
        {status && (
          <Badge label={getLabel('status', status)} onClear={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('status');
            router.push(`/properties?${params.toString()}`, { scroll: false });
          }} />
        )}
      </div>
    </div>
  );
}

function Badge({ label, onClear }: { label: string, onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-[#091E34]/80 text-white rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg">
      {label}
      <button onClick={onClear} className="ml-0.5 hover:text-white/60 transition-colors cursor-pointer">
        <X size={10} />
      </button>
    </span>
  );
}
