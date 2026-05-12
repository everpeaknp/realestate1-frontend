'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame, AnimatePresence } from 'framer-motion';
import { EagleProperty } from '@/lib/eagle-api';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyGalleryProps {
  property: EagleProperty;
}

export default function PropertyGallery({ property }: PropertyGalleryProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  // Skip the first image (used as hero) and show all remaining images
  const images = (property.images ?? []).slice(1);

  if (images.length === 0) return null;

  // Create a much larger array for truly infinite scrolling (5 copies)
  const infiniteImages = [
    ...images,
    ...images,
    ...images,
    ...images,
    ...images,
  ];

  const imageWidth = 480 + 24; // width + gap
  const singleSetWidth = images.length * imageWidth;

  // Auto-scroll animation with seamless loop
  useAnimationFrame(() => {
    if (!isDragging && containerRef.current && selectedImage === null) {
      const currentX = x.get();
      const speed = 1.5; // Increased speed for smoother, faster scrolling
      let newX = currentX - speed;
      
      // Seamless infinite loop - reset when reaching boundaries
      // We have 5 sets, so we can safely scroll through middle 3 sets
      if (newX < -singleSetWidth * 3) {
        newX = newX + singleSetWidth;
      } else if (newX > -singleSetWidth) {
        newX = newX - singleSetWidth;
      }
      
      x.set(newX);
    }
  });

  const openLightbox = (index: number) => {
    setSelectedImage(index % images.length);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev') {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    } else {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  // Initialize to middle position
  useEffect(() => {
    x.set(-singleSetWidth * 2); // Start at the middle set (3rd set out of 5)
  }, []);

  // Handle drag with seamless repositioning
  const handleDrag = () => {
    const currentX = x.get();
    
    // Reposition seamlessly during drag if we're getting too far
    if (currentX < -singleSetWidth * 3.5) {
      x.set(currentX + singleSetWidth);
    } else if (currentX > -singleSetWidth * 0.5) {
      x.set(currentX - singleSetWidth);
    }
  };

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
  }, [selectedImage]);

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
                  <img
                    src={img.url}
                    alt={`${property.formattedAddress} — photo ${(idx % images.length) + 2}`}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-105 pointer-events-none"
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
              className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImage].url}
                alt={`${property.formattedAddress} — photo ${selectedImage + 2}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
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
