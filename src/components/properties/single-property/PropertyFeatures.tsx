'use client';

import { CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PropertyFeatures() {
  const features = [
    'Swimming Pool',
    'Window Coverings',
    'Lawn',
    'Laundry',
    'Air Conditioning',
    'Barbeque',
    'Outdoor Shower',
    'Refrigerator',
  ];

  return (
    <div className="bg-white overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-6 sm:mb-8">Features</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-y-4 sm:gap-x-8 md:gap-x-12">
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            className="flex items-center gap-2.5 sm:gap-3 group py-1"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <CheckSquare size={16} className="sm:w-[18px] sm:h-[18px] text-[#5d6d87] group-hover:text-[#c1a478] transition-colors flex-shrink-0" />
            <span className="text-[#7C7A70] text-sm sm:text-[15px] font-medium group-hover:text-[#1a1a1a] transition-colors">
              {feature}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Bottom Divider */}
      <div className="w-full h-px bg-gray-100 mt-12 sm:mt-16" />
    </div>
  );
}
