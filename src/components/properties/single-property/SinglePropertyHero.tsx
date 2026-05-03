'use client';

import { MapPin, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

interface PropertyData {
  title: string;
  location: {
    display: string;
  };
  price: string;
  sqft: number;
  main_image: string | null;
}

export default function SinglePropertyHero({ property }: { property: PropertyData }) {
  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return `$${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const getPropertyImage = (image: string | null) => {
    if (image && image.startsWith('http')) return image;
    if (image) return `${process.env.NEXT_PUBLIC_API_URL}${image}`;
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920';
  };

  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] min-h-[400px] sm:min-h-[500px] flex items-end justify-center overflow-hidden">
      {/* Fixed Background Image */}
      <div 
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url("${getPropertyImage(property.main_image)}")`,
        }}
      >
        {/* Bottom Black Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          {/* Left Side: Title and Location */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-[#c1a478]">
              <MapPin size={18} className="sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" fillOpacity={0.2} />
              <span className="text-white/90 text-sm sm:text-base md:text-lg font-medium">
                {property.location.display}
              </span>
            </div>
          </motion.div>

          {/* Right Side: Price and Area */}
          <motion.div
            className="md:text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              {formatPrice(property.price)}
            </div>
            <div className="flex items-center md:justify-end gap-2 text-[#c1a478]">
              <Maximize size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-white/90 text-sm sm:text-base md:text-lg font-medium">
                {property.sqft.toLocaleString()} sq ft
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
