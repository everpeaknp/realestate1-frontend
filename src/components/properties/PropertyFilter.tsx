'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showFilters, setShowFilters] = useState(false);

  // Sync filter state with URL parameters
  useEffect(() => {
    setPropertyType(searchParams.get('property_type') || '');
    setMinPrice(searchParams.get('min_price') || '');
    setMaxPrice(searchParams.get('max_price') || '');
    setBeds(searchParams.get('beds') || '');
    setStatus(searchParams.get('status') || '');
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Remove page when applying filters
    params.delete('page');
    
    // Update filter parameters
    if (propertyType) params.set('property_type', propertyType);
    else params.delete('property_type');
    
    if (minPrice) params.set('min_price', minPrice);
    else params.delete('min_price');
    
    if (maxPrice) params.set('max_price', maxPrice);
    else params.delete('max_price');
    
    if (beds) params.set('beds', beds);
    else params.delete('beds');
    
    if (status) params.set('status', status);
    else params.delete('status');
    
    router.push(`/properties?${params.toString()}`, { scroll: false });
    setShowFilters(false);
    
    if (onFilterChange) {
      onFilterChange();
    }
  };

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
    setShowFilters(false);
    
    if (onFilterChange) {
      onFilterChange();
    }
  };

  const hasActiveFilters = !!(propertyType || minPrice || maxPrice || beds || status);

  return (
    <div className="mb-8">
      {/* Filter Toggle Button */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-3 rounded-sm font-bold text-sm tracking-wider transition-all ${
            showFilters
              ? 'bg-[#c1a478] text-white'
              : 'bg-white text-[#1a1a1a] border-2 border-gray-200 hover:border-[#c1a478]'
          }`}
        >
          <SlidersHorizontal size={18} />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          {hasActiveFilters && !showFilters && (
            <span className="ml-1 w-2 h-2 bg-[#c1a478] rounded-full" />
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-[#FFFAF3] border border-gray-200 rounded-sm p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                {/* Property Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#c1a478] transition-colors"
                  >
                    <option value="">All Types</option>
                    <option value="FOR_SALE">For Sale</option>
                    <option value="FOR_RENT">For Rent</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Min Price
                  </label>
                  <select
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#c1a478] transition-colors"
                  >
                    <option value="">No Min</option>
                    <option value="100000">$100,000</option>
                    <option value="200000">$200,000</option>
                    <option value="300000">$300,000</option>
                    <option value="400000">$400,000</option>
                    <option value="500000">$500,000</option>
                    <option value="750000">$750,000</option>
                    <option value="1000000">$1,000,000</option>
                  </select>
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Max Price
                  </label>
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#c1a478] transition-colors"
                  >
                    <option value="">No Max</option>
                    <option value="200000">$200,000</option>
                    <option value="300000">$300,000</option>
                    <option value="400000">$400,000</option>
                    <option value="500000">$500,000</option>
                    <option value="750000">$750,000</option>
                    <option value="1000000">$1,000,000</option>
                    <option value="2000000">$2,000,000</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Bedrooms
                  </label>
                  <select
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#c1a478] transition-colors"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#c1a478] transition-colors"
                  >
                    <option value="">All Status</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="PENDING">Pending</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={applyFilters}
                  className="px-8 py-2.5 bg-[#c1a478] hover:bg-[#a8895f] text-white font-bold text-sm tracking-wider rounded-sm transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-2.5 bg-white hover:bg-gray-50 text-[#1a1a1a] border-2 border-gray-300 font-bold text-sm tracking-wider rounded-sm transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {propertyType && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#c1a478]/10 text-[#c1a478] rounded-full text-xs font-medium">
              {propertyType.replace('_', ' ')}
            </span>
          )}
          {minPrice && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#c1a478]/10 text-[#c1a478] rounded-full text-xs font-medium">
              Min: ${parseInt(minPrice, 10).toLocaleString()}
            </span>
          )}
          {maxPrice && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#c1a478]/10 text-[#c1a478] rounded-full text-xs font-medium">
              Max: ${parseInt(maxPrice, 10).toLocaleString()}
            </span>
          )}
          {beds && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#c1a478]/10 text-[#c1a478] rounded-full text-xs font-medium">
              {beds}+ Beds
            </span>
          )}
          {status && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#c1a478]/10 text-[#c1a478] rounded-full text-xs font-medium">
              {status}
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-[#c1a478] hover:underline font-semibold text-xs"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
