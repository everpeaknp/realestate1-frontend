'use client';

import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

interface VideoTestimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  video_url: string;
  title: string;
  rating: number;
}

export default function VideoTestimonials() {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  useEffect(() => {
    const fetchVideoTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}/api/testimonials/video/`);
        if (response.ok) {
          const data = await response.json();
          console.log('Video testimonials:', data);
          // Filter to only show testimonials with video URLs
          const videoTestimonials = Array.isArray(data) 
            ? data.filter(t => t.video_url && t.video_url.trim() !== '')
            : [];
          setTestimonials(videoTestimonials);
        }
      } catch (error) {
        console.error('Error fetching video testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoTestimonials();
  }, []);

  const getYouTubeEmbedUrl = (url: string) => {
    // Convert various YouTube URL formats to embed URL
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?\/\s]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1`;
    }
    return url;
  };

  const handleVideoClick = (testimonialId: number) => {
    setPlayingVideo(testimonialId);
  };

  // Don't render the section if there are no video testimonials
  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative aspect-[16/9] rounded-sm overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onClick={() => handleVideoClick(item.id)}
            >
              {playingVideo === item.id ? (
                /* Video Player */
                <iframe
                  src={getYouTubeEmbedUrl(item.video_url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={item.title}
                />
              ) : (
                /* Thumbnail View */
                <>
                  {/* Background Image */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/50" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 text-white">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 sm:mb-8 tracking-tight px-2 sm:px-4 font-sans">
                      {item.title}
                    </h3>

                    {/* Play Button */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-lg transition-transform duration-500 group-hover:scale-110">
                      <Play size={20} className="sm:w-6 sm:h-6 text-[#1a1a1a] fill-current ml-1" />
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-3 sm:mb-4">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} size={14} className="sm:w-4 sm:h-4 text-[#f1c40f] fill-current" />
                      ))}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-1">
                      <span className="text-base sm:text-lg font-bold tracking-tight">{item.name}</span>
                      <span className="text-xs sm:text-sm text-white/80 font-medium uppercase tracking-widest">{item.role}</span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
