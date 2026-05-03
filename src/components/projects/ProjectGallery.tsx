'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface ProjectImage {
  id: number;
  image: string;
  title: string;
  caption: string;
  order: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  images: ProjectImage[];
  location: string;
  completion_date: string;
  category: string;
  is_featured: boolean;
  order: number;
}

export default function ProjectGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [allImages, setAllImages] = useState<Array<{ url: string; title: string; caption: string; projectTitle: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects/`);
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          
          // Handle paginated response - extract results array
          const projects: Project[] = data.results || data;
          
          // Flatten all images from all projects
          const images = projects.flatMap(project => 
            project.images.map(img => ({
              url: img.image,
              title: img.title || project.title,
              caption: img.caption || '',
              projectTitle: project.title
            }))
          );
          
          setAllImages(images);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? allImages.length - 1 : selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === allImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (allImages.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {allImages.map((image, index) => (
            <motion.div
              key={index}
              className="relative group overflow-hidden rounded-sm break-inside-avoid shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index % 4 * 0.1 }}
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 sm:p-6">
                <p className="text-white font-bold text-base sm:text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {image.title}
                </p>
                <div className="w-10 sm:w-12 h-1 bg-[#c1a478] mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 transition-colors z-10 p-2"
              onClick={() => setSelectedImage(null)}
              aria-label="Close lightbox"
            >
              <X size={24} className="sm:w-8 sm:h-8" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-white text-xs sm:text-sm font-medium z-10 bg-black/50 px-2 py-1 rounded">
              {selectedImage + 1} / {allImages.length}
            </div>

            {/* Previous Button */}
            <button
              className="absolute left-2 sm:left-4 text-white hover:text-gray-300 transition-colors z-10 p-2 bg-black/50 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={32} className="sm:w-12 sm:h-12" />
            </button>

            {/* Next Button */}
            <button
              className="absolute right-2 sm:right-4 text-white hover:text-gray-300 transition-colors z-10 p-2 bg-black/50 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={32} className="sm:w-12 sm:h-12" />
            </button>

            {/* Image Container */}
            <div className="flex flex-col items-center justify-center max-w-[95%] sm:max-w-[90%] max-h-[90%]">
              <motion.img
                key={selectedImage}
                src={allImages[selectedImage].url}
                alt={allImages[selectedImage].title}
                className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Title and Caption below image */}
              <motion.div
                className="mt-4 sm:mt-6 text-center max-w-2xl px-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-white text-base sm:text-xl font-bold mb-1 sm:mb-2">
                  {allImages[selectedImage].title}
                </h3>
                {allImages[selectedImage].caption && (
                  <p className="text-gray-300 text-xs sm:text-sm">
                    {allImages[selectedImage].caption}
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
