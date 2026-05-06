'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { EagleProperty, EagleFloorPlan } from '@/lib/eagle-api';
import LazyImage from '@/components/shared/LazyImage';

interface PropertyFloorPlanProps {
  property: EagleProperty;
}

export default function PropertyFloorPlan({ property }: PropertyFloorPlanProps) {
  // Eagle uses lowercase 'floorplans'
  const floorPlans: EagleFloorPlan[] = property.floorplans || [];

  if (floorPlans.length === 0) {
    return null;
  }

  return (
    <div className="bg-white">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <FileText size={24} className="text-[#c1a478]" />
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Floor Plans</h2>
      </div>

      <div className="space-y-6">
        {floorPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-[#FFFAF3] border border-gray-100 rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <LazyImage
                src={plan.url}
                alt={`Floor plan ${index + 1}`}
                className="w-full h-auto rounded"
              />
            </div>
            <div className="px-6 pb-6">
              <a
                href={plan.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#c1a478] hover:text-[#b39468] font-semibold transition-colors"
              >
                <FileText size={18} />
                View Full Size
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="w-full h-px bg-gray-100 mt-16" />
    </div>
  );
}
