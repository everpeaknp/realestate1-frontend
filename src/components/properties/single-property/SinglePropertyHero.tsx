'use client';

import { motion } from 'framer-motion';
import { EagleProperty } from '@/lib/eagle-api';
import Image from 'next/image';

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
      <Image
        src={mainImage}
        alt={property.formattedAddress}
        fill
        priority
        sizes="100vw"
        quality={62}
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='24'%3E%3Crect width='100%25' height='100%25' fill='%23e7e7e7'/%3E%3C/svg%3E"
        className="object-cover"
      />
    </motion.div>
  );
}
