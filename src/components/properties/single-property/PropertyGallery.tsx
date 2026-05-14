'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useAnimationFrame, AnimatePresence } from 'framer-motion';
import { EagleProperty } from '@/lib/eagle-api';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface PropertyGalleryProps {
  property: EagleProperty;
}

export default function PropertyGallery({ property }: PropertyGalleryProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Skip the first image (used as hero) and show all remaining images
  const images = (property.images ?? []).slice(1, 13);
  const hasImages = images.length > 0;

  // Keep duplication modest to avoid heavy decode/network churn.
  const infiniteImages = hasImages
    ? [...images, ...images, ...images]
    : [];

  const imageWidth = 480 + 24; // width + gap
  const singleSetWidth = hasImages ? images.length * imageWidth : 0;

  const openLightbox = useCallback(
    (index: number) => {
      if (!hasImages) return;
      setSelectedImage(index % images.length);
    },
    [hasImages, images.length]
  );

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const navigateLightbox = useCallback(
    (direction: 'prev' | 'next') => {
      if (!hasImages) return;

      setSelectedImage((currentImage) => {
        if (currentImage === null) return currentImage;

        if (direction === 'prev') {
          return (currentImage - 1 + images.length) % images.length;
        }

        return (currentImage + 1) % images.length;
      });
    },
    [hasImages, images.length]
  );

  // Auto-scroll animation with seamless loop
  useAnimationFrame(() => {
    if (!hasImages || isDragging || !containerRef.current || selectedImage !== null || singleSetWidth === 0) {
      return;
    }

    const currentX = x.get();
    const speed = 1.5; // Increased speed for smoother, faster scrolling
    let newX = currentX - speed;

    // Seamless infinite loop - reset when reaching boundaries
    // We have 5 sets, so we can safely scroll through middle 3 sets
    if (newX < -singleSetWidth * 2) {
      newX += singleSetWidth;
    } else if (newX > 0) {
      newX -= singleSetWidth;
    }

    x.set(newX);
  });

  // Initialize to middle position
  useEffect(() => {
    if (!hasImages || singleSetWidth === 0) return;
    x.set(-singleSetWidth); // Start at the middle set (2nd set out of 3)
  }, [hasImages, singleSetWidth, x]);

  // Handle drag with seamless repositioning
  const handleDrag = useCallback(() => {
    if (!hasImages || singleSetWidth === 0) return;

    const currentX = x.get();

    // Reposition seamlessly during drag if we're getting too far
    if (currentX < -singleSetWidth * 2.5) {
      x.set(currentX + singleSetWidth);
    } else if (currentX > -singleSetWidth * 0.5) {
      x.set(currentX - singleSetWidth);
    }
  }, [hasImages, singleSetWidth, x]);

  // ESC key handler for closing lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage !== null) {
        closeLightbox();
      }
      if (e.key === 'ArrowLeft' && selectedImage !== null) {
        navigateLightbox('prev');
      }
      if (e.key === 'ArrowRight' && selectedImage !== null) {
        navigateLightbox('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, closeLightbox, navigateLightbox]);

  if (!hasImages) return null;

  return (
    <>
      <div className="w-full py-12 relative z-10 overflow-hidden" style={{ backgroundColor: '#FAF9F9' }}>
        <div 
          ref={containerRef}
          className="relative cursor-grab active:cursor-grabbing select-none"
        >
          <motion.div
            className="flex gap-6 px-6"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -Infinity, right: Infinity }}
            onDragStart={() => setIsDragging(true)}
            onDrag={handleDrag}
            onDragEnd={() => setIsDragging(false)}
            dragElastic={0}
            dragMomentum={false}
          >
            {infiniteImages.map((img, idx) => (
              <motion.div
                key={idx}
                className="flex-shrink-0 overflow-hidden rounded-xl group cursor-grab active:cursor-grabbing bg-gray-100"
                style={{ 
                  width: '480px',
                  height: '360px'
                }}
                onClick={() => !isDragging && openLightbox(idx)}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative w-full h-full cursor-grab active:cursor-grabbing">
                  <Image
                    src={img.url}
                    alt={`${property.formattedAddress} — photo ${(idx % images.length) + 2}`}
                    fill
                    sizes="(max-width: 768px) 92vw, 480px"
                    quality={56}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='36'%3E%3Crect width='100%25' height='100%25' fill='%23ececec'/%3E%3C/svg%3E"
                    className="object-cover transition-all duration-300 group-hover:brightness-105 pointer-events-none"
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button - Enhanced visibility */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:text-white transition-all duration-200 z-[10000] group"
              aria-label="Close"
            >
              <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('prev');
              }}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:text-white transition-all duration-200 z-50 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('next');
              }}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:text-white transition-all duration-200 z-50 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>

            {/* Image */}
            <motion.div
              key={selectedImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-[90vw] h-[90vh] max-w-[1600px] max-h-[1000px] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedImage].url}
                alt={`${property.formattedAddress} — photo ${selectedImage + 2}`}
                fill
                sizes="90vw"
                quality={70}
                priority
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='36'%3E%3Crect width='100%25' height='100%25' fill='%231b1b1b'/%3E%3C/svg%3E"
                className="object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              {selectedImage + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
