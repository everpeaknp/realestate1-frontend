'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bed, Bath, Car, ArrowRight } from 'lucide-react';
import { Property } from './types';
import Link from 'next/link';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group cursor-pointer w-full"
    >
      <div className="relative overflow-hidden rounded-2xl md:rounded-[2.5rem] aspect-[4/5] mb-5 md:mb-6 bg-brand-surface-container">
        {property.tag && (
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
            <span className={`${property.tagColor || 'bg-brand-primary'} text-white px-3 md:px-4 py-1 md:py-1.5 rounded-full font-sans text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-sm`}>
              {property.tag}
            </span>
          </div>
        )}
        
        <Image
          src={property.image || '/images/placeholder-property.jpg'}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          quality={70}
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col gap-3 px-1">
        <div className="space-y-1">
          <h3 className="font-serif text-lg md:text-xl text-brand-primary leading-tight line-clamp-2">
            {property.title}
          </h3>
          <p className="font-serif text-base md:text-lg font-medium text-brand-secondary">
            {property.price}
          </p>
          <p className="font-sans text-[10px] md:text-xs text-brand-outline tracking-wide truncate mt-1">
            {property.location}
          </p>
        </div>

        <div className="flex items-center gap-4 text-brand-outline pt-1">
          <div className="flex items-center gap-1.5">
            <Bed size={16} strokeWidth={1.5} className="text-brand-outline/70" />
            <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase">{property.beds}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={16} strokeWidth={1.5} className="text-brand-outline/70" />
            <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase">{property.baths}</span>
          </div>
          {property.cars > 0 && (
            <div className="flex items-center gap-1.5">
              <Car size={16} strokeWidth={1.5} className="text-brand-outline/70" />
              <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase">{property.cars}</span>
            </div>
          )}
        </div>

        <div className="pt-3">
          <Link 
            href={`/properties/${property.slug || property.id}`}
            className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-widest uppercase text-brand-primary border-b border-brand-primary/20 pb-1 hover:border-brand-primary hover:gap-3 transition-all duration-300"
          >
            VIEW PROPERTY <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default PropertyCard;
