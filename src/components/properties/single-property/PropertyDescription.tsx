'use client';

import { Building2, Bookmark, Maximize, Ruler, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { EagleProperty } from '@/lib/eagle-api';

interface PropertyDescriptionProps {
  property: EagleProperty;
}

export default function PropertyDescription({ property }: PropertyDescriptionProps) {
  const details = [
    {
      icon: <Maximize size={18} className="sm:w-5 sm:h-5" />,
      value: property.landSize ?? 'N/A',
      label: 'Land Size',
    },
    {
      icon: <Ruler size={18} className="sm:w-5 sm:h-5" />,
      value: property.landSizeUnits ?? '—',
      label: 'Size Units',
    },
    {
      icon: <Calendar size={18} className="sm:w-5 sm:h-5" />,
      value: property.createdAt ? new Date(property.createdAt).getFullYear().toString() : 'N/A',
      label: 'Listed',
    },
  ];

  const getPropertyTypeDisplay = (type?: string) => {
    if (!type) return 'Property';
    return type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  const getStatusDisplay = (status?: string) => {
    if (!status) return 'Available';
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <div className="bg-white">
      {/* Description */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-4 sm:mb-6">Description</h2>
        {property.description ? (
          <div className="text-[#7C7A70] text-sm sm:text-[15px] leading-[1.8] max-w-5xl">
            {property.description.split('\n').map((paragraph, index) =>
              paragraph.trim() ? (
                <p key={index} className="mb-4">{paragraph}</p>
              ) : null
            )}
          </div>
        ) : (
          <p className="text-[#7C7A70] text-sm sm:text-[15px]">
            Contact us for more information about this property.
          </p>
        )}
      </div>

      {/* Property Type & Status */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#5d6d87] flex items-center justify-center text-white rounded-sm flex-shrink-0">
            <Building2 size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="block text-[10px] sm:text-[11px] font-bold text-[#5d6d87] uppercase tracking-wider mb-1">
              Property Type
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1a1a1a]">
              {getPropertyTypeDisplay(property.propertyType)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#5d6d87] flex items-center justify-center text-white rounded-sm flex-shrink-0">
            <Bookmark size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="block text-[10px] sm:text-[11px] font-bold text-[#5d6d87] uppercase tracking-wider mb-1">
              Property Status
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1a1a1a]">
              {getStatusDisplay(property.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-100 mb-8 sm:mb-12" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-y-10 sm:gap-x-8 md:gap-x-12">
        {details.map((detail, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-4 sm:gap-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-100 flex items-center justify-center text-[#5d6d87]/40 rounded-sm flex-shrink-0">
              {detail.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg sm:text-xl font-bold text-[#1a1a1a] mb-0.5 truncate">{detail.value}</span>
              <span className="text-xs sm:text-[13px] font-bold text-[#5d6d87]/60 tracking-tight">{detail.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Divider */}
      <div className="w-full h-px bg-gray-100 mt-12 sm:mt-16" />
    </div>
  );
}
