'use client';

import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { EagleProperty } from '@/lib/eagle-api';
import LazyImage from '@/components/shared/LazyImage';

interface SinglePropertyHeroProps {
  property: EagleProperty;
}

export default function SinglePropertyHero({ property }: SinglePropertyHeroProps) {
  const mainImage = property.images && property.images.length > 0
    ? property.images[0].url
    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920';

  const formatPrice = () => {
    if (property.advertisedPrice) return property.advertisedPrice;
    if (property.price) {
      return `$${property.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
    return 'Contact for price';
  };

  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <LazyImage
          src={mainImage}
          alt={property.formattedAddress}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="max-w-7xl mx-auto px-6 pb-12 md:pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            {/* Status Badge */}
            <div className="inline-block mb-4">
              <span className="text-white px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-lg" style={{ background: '#091E34' }}>
                {property.status || 'Available'}
              </span>
            </div>

            {/* Address */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {property.formattedAddress}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={20} style={{ color: '#091E34' }} />
              <span className="text-lg text-gray-200">
                {property.formattedAddress}
              </span>
            </div>

            {/* Price */}
            <div className="text-4xl md:text-5xl font-bold" style={{ color: '#091E34' }}>
              {formatPrice()}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
