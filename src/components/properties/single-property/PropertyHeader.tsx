'use client';

import { motion } from 'framer-motion';
import { Bed, Bath, Car } from 'lucide-react';
import { EagleProperty } from '@/lib/eagle-api';
import { parsePropertyStats } from '@/lib/property-utils';

interface PropertyHeaderProps {
  property: EagleProperty;
}

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  const addressParts = property.formattedAddress?.split(',');
  const streetAddress = addressParts?.[0]?.trim() ?? property.formattedAddress;
  const suburbLine = addressParts && addressParts.length > 1
    ? addressParts.slice(1).join(',').trim()
    : '';

  const formatPrice = (): { display: string; isRaw: boolean } | null => {
    if (property.advertisedPrice) {
      // Strip anything after | or — e.g. "$730,000 | For Enquiry: 0447 784 916"
      const cleaned = property.advertisedPrice.split(/\s*[|—–]\s*/)[0].trim();
      // If it looks like a price (contains $ or digits), use it
      if (/[\d$]/.test(cleaned)) return { display: cleaned, isRaw: false };
    }
    if (property.price) {
      return {
        display: property.price.toLocaleString('en-US', { maximumFractionDigits: 0 }),
        isRaw: true,
      };
    }
    return null;
  };

  const priceResult = formatPrice();
  const price = priceResult?.display ?? null;
  const isRawNumber = priceResult?.isRaw ?? false;

  // Eagle API has no dedicated bed/bath/car fields — parse from description + headline text
  const { beds, baths, cars } = parsePropertyStats(property);

  // Debug: log what we parsed (remove after confirming it works)
  if (typeof window !== 'undefined') {
    console.log('[PropertyHeader] headline:', property.headline?.slice(0, 80));
    console.log('[PropertyHeader] desc snippet:', property.description?.slice(0, 200));
    console.log('[PropertyHeader] parsed:', { beds, baths, cars });
  }

  return (
    <section className="w-full bg-[#FAF9F9] pb-16">
      <div className="mt-32 max-w-7xl mx-auto px-6 md:px-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-4 block">
            {suburbLine}
          </span>

          <h1 className="text-5xl md:text-7xl font-serif text-primary mb-8 tracking-tight">
            {streetAddress}
          </h1>

          <div className="flex flex-wrap gap-8 text-on-surface-variant">
            {beds !== null && (
              <div className="flex items-center gap-3">
                <Bed className="w-5 h-5 text-neutral-400" />
                <span className="text-lg font-medium">
                  {beds} {beds === 1 ? 'Bedroom' : 'Bedrooms'}
                </span>
              </div>
            )}
            {baths !== null && (
              <div className="flex items-center gap-3">
                <Bath className="w-5 h-5 text-neutral-400" />
                <span className="text-lg font-medium">
                  {baths} {baths === 1 ? 'Bathroom' : 'Bathrooms'}
                </span>
              </div>
            )}
            {cars !== null && (
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-neutral-400" />
                <span className="text-lg font-medium">
                  {cars} Car {cars === 1 ? 'Space' : 'Spaces'}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {price ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-left md:text-right"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
              Asking Price
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-primary leading-none tracking-tighter">
              {isRawNumber ? (
                <>
                  <span className="text-lg align-top mr-1">$</span>
                  {price}
                </>
              ) : (
                price
              )}
            </h2>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-left md:text-right"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
              Price
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-primary leading-none tracking-tighter">
              Contact Us
            </h2>
          </motion.div>
        )}

      </div>

      <div className="w-full h-[1px] bg-neutral-200 mt-16"></div>
      </div>
    </section>
  );
}
