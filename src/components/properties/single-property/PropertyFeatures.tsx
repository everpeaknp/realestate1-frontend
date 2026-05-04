'use client';

import { motion } from 'framer-motion';
import { Maximize } from 'lucide-react';
import { EagleProperty } from '@/lib/eagle-api';

interface PropertyFeaturesProps {
  property: EagleProperty;
}

export default function PropertyFeatures({ property }: PropertyFeaturesProps) {
  // Eagle API does not expose a features array on the base Property type.
  // Show land size details if available.
  if (!property.landSize && !property.landSizeUnits) {
    return null;
  }

  return (
    <section className="bg-white">
      <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-6 sm:mb-8">
        Property Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {property.landSize && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4 p-4 bg-[#FFFAF3] border border-gray-100 rounded hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-[#c1a478]/10 rounded flex items-center justify-center flex-shrink-0">
              <Maximize size={24} className="text-[#c1a478]" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Land Size</span>
              <p className="text-base font-bold text-[#1a1a1a]">
                {property.landSize}{property.landSizeUnits ? ` ${property.landSizeUnits}` : ''}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
