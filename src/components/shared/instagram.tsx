'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { homeAPI } from '@/lib/api';

// Custom Instagram Icon Component
const InstagramIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const defaultInstagramImages = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
];

interface InstagramImage {
  id: number;
  image: string;
  link: string;
  alt_text: string;
  order: number;
  is_active: boolean;
}

interface InstagramGalleryProps {
  images?: any[];
}

export default function InstagramGallery({ images: propImages }: InstagramGalleryProps) {
  const [images, setImages] = useState<InstagramImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await homeAPI.getInstagram();
        if (data && data.length > 0) {
          setImages(data);
        } else {
          // Use default images if no data from API
          setImages(defaultInstagramImages.map((img, index) => ({
            id: index,
            image: img,
            link: '#',
            alt_text: `Instagram post ${index + 1}`,
            order: index,
            is_active: true,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch Instagram images:', error);
        // Use default images on error
        setImages(defaultInstagramImages.map((img, index) => ({
          id: index,
          image: img,
          link: '#',
          alt_text: `Instagram post ${index + 1}`,
          order: index,
          is_active: true,
        })));
      } finally {
        setLoading(false);
      }
    };

    // Use prop images if provided, otherwise fetch from API
    if (propImages && propImages.length > 0) {
      setImages(propImages);
      setLoading(false);
    } else {
      fetchImages();
    }
  }, [propImages]);

  if (loading) {
    return null;
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-8 sm:py-12 pb-0 overflow-hidden">
      {/* Feed Header */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-4">
        <InstagramIcon size={18} className="sm:w-5 sm:h-5 text-[#5d6d87]" />
        <h2 className="text-xs sm:text-[13px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#5d6d87] uppercase">
          Follow us on Instagram
        </h2>
      </div>

      {/* Grid of Images */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
          {images.map((img, index) => (
            <motion.a
              key={img.id || index}
              href={img.link || '#'}
              target={img.link && img.link !== '#' ? '_blank' : undefined}
              rel={img.link && img.link !== '#' ? 'noopener noreferrer' : undefined}
              className="w-full aspect-square overflow-hidden relative group block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <img 
                src={img.image} 
                alt={img.alt_text || `Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#c1a478]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <InstagramIcon size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
