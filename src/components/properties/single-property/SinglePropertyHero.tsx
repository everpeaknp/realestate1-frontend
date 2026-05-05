'use client';

import { MapPin, Share2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { EagleProperty } from '@/lib/eagle-api';

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.formattedAddress,
          text: `Check out this property: ${property.formattedAddress}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleFavorite = () => {
    // TODO: Implement favorite functionality
    alert('Favorite functionality coming soon!');
  };

  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
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
              <span className="bg-[#c1a478] text-white px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
                {property.status || 'Available'}
              </span>
            </div>

            {/* Address */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {property.formattedAddress}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={20} className="text-[#c1a478]" />
              <span className="text-lg text-gray-200">
                {property.formattedAddress}
              </span>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-4xl md:text-5xl font-bold text-[#c1a478]">
                {formatPrice()}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-5 py-3 rounded transition-colors"
                  aria-label="Share property"
                >
                  <Share2 size={18} />
                  <span className="hidden sm:inline text-sm font-semibold">Share</span>
                </button>
                <button
                  onClick={handleFavorite}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-5 py-3 rounded transition-colors"
                  aria-label="Add to favorites"
                >
                  <Heart size={18} />
                  <span className="hidden sm:inline text-sm font-semibold">Save</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
