'use client';

import { motion } from 'framer-motion';
import { EagleProperty } from '@/lib/eagle-api';

interface PropertyGalleryProps {
  property: EagleProperty;
}

export default function PropertyGallery({ property }: PropertyGalleryProps) {
  // Skip the first image (used as hero) and take up to 3 more
  const images = (property.images ?? [])
    .slice(1, 4)
    .map((img, idx) => ({
      src: img.url,
      alt: `${property.formattedAddress} — photo ${idx + 2}`,
      delay: 0.2 + idx * 0.2,
    }));

  if (images.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: img.delay, duration: 0.8 }}
            viewport={{ once: true }}
            className="h-64 md:h-80 overflow-hidden rounded-xl shadow-2xl group"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
