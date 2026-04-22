'use client';

import { Building2, Bookmark, Maximize, Bed, Bath, Car, Ruler, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface PropertyData {
  description: string;
  property_type: string;
  status: string;
  sqft: number;
  beds: number;
  baths: number;
  garage: number;
  lot_size: number | null;
  year_built: number | null;
}

export default function PropertyDescription({ property }: { property: PropertyData }) {
  const details = [
    { icon: <Maximize size={20} />, value: property.sqft.toLocaleString(), label: 'Property Size' },
    { icon: <Bed size={20} />, value: property.beds.toString(), label: 'Bedrooms' },
    { icon: <Bath size={20} />, value: property.baths.toString(), label: 'Bathrooms' },
    { icon: <Car size={20} />, value: property.garage.toString(), label: 'Garage' },
    { icon: <Ruler size={20} />, value: property.lot_size ? property.lot_size.toLocaleString() : 'N/A', label: 'Lot Size' },
    { icon: <Calendar size={20} />, value: property.year_built ? property.year_built.toString() : 'N/A', label: 'Year Built' },
  ];

  const getPropertyTypeDisplay = (type: string) => {
    return type === 'FOR_SALE' ? 'For Sale' : 'For Rent';
  };

  const getStatusDisplay = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <div className="bg-white">
      {/* Description Heading & Text */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6 font-sans">Description</h2>
        <div 
          className="text-[#7C7A70] text-[15px] leading-[1.8] max-w-5xl font-sans"
          dangerouslySetInnerHTML={{ __html: property.description }}
        />
      </div>

      {/* Property Type & Status Blocks */}
      <div className="flex flex-wrap gap-12 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#5d6d87] flex items-center justify-center text-white rounded-sm">
            <Building2 size={24} />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-[#5d6d87] uppercase tracking-wider mb-1">
              Property Type
            </span>
            <span className="text-lg font-bold text-[#1a1a1a]">{getPropertyTypeDisplay(property.property_type)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#5d6d87] flex items-center justify-center text-white rounded-sm">
            <Bookmark size={24} />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-[#5d6d87] uppercase tracking-wider mb-1">
              Property Status
            </span>
            <span className="text-lg font-bold text-[#1a1a1a]">{getStatusDisplay(property.status)}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-100 mb-12" />

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
        {details.map((detail, index) => (
          <motion.div 
            key={index} 
            className="flex items-center gap-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-16 h-16 border border-gray-100 flex items-center justify-center text-[#5d6d87]/40 rounded-sm">
              {detail.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#1a1a1a] mb-0.5">{detail.value}</span>
              <span className="text-[13px] font-bold text-[#5d6d87]/60 tracking-tight">{detail.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Divider */}
      <div className="w-full h-px bg-gray-100 mt-16" />
    </div>
  );
}
