'use client';

import { motion } from 'framer-motion';
import { EagleProperty } from '@/lib/eagle-api';

interface SinglePropertyHeroProps {
  property: EagleProperty;
}

export default function SinglePropertyHero({ property }: SinglePropertyHeroProps) {
  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0].url
      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2 }}
      viewport={{ once: true }}
      className="w-full h-[60vh] md:h-[85vh] overflow-hidden"
    >
      <img
        src={mainImage}
        alt={property.formattedAddress}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}
