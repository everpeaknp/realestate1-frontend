'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', title: 'Modern Villa Exterior' },
  { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', title: 'Luxury Pool Area' },
  { url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d', title: 'Contemporary Living Room' },
  { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136', title: 'Elegant Kitchen' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', title: 'Minimalist Balcony' },
  { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0', title: 'Skylight Hallway' },
  { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde', title: 'Architecture Detail' },
  { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace', title: 'Cozy Bedroom' },
  { url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68', title: 'Dining Space' },
  { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', title: 'Outdoor Patio' },
  { url: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099', title: 'Staircase Design' },
  { url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab', title: 'Garden Landscape' },
  { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858', title: 'Home Office' },
  { url: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198', title: 'Modern Entrance' },
  { url: 'https://images.unsplash.com/photo-1615873968403-89e068629265', title: 'Interior Detail' },
  { url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab', title: 'Bathroom Luxury' },
];

export default function ProjectGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative group overflow-hidden rounded-sm break-inside-avoid shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index % 4 * 0.1 }}
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={`${image.url}?auto=format&fit=crop&q=80&w=800`} 
                alt={image.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <p className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {image.title}
                </p>
                <div className="w-12 h-1 bg-[#c1a478] mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 text-white text-sm font-medium z-10">
              {selectedImage + 1} / {images.length}
            </div>

            {/* Previous Button */}
            <button
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
            >
              <ChevronLeft size={48} />
            </button>

            {/* Next Button */}
            <button
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ChevronRight size={48} />
            </button>

            {/* Image */}
            <motion.img
              key={selectedImage}
              src={`${images[selectedImage].url}?auto=format&fit=crop&q=80&w=1920`}
              alt={images[selectedImage].title}
              className="max-w-[90%] max-h-[90%] object-contain"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
