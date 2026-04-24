'use client';

import { Play, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

interface Testimonial {
  id: string;
  title: string;
  text: string;
  name: string;
  role: string;
  image: string;
  video_url?: string | null;
}

function StarRating() {
  return (
    <div className="flex items-center justify-center gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={18} className="text-[#F0AD4E]" fill="#F0AD4E" stroke="none" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log('Fetching featured testimonials from:', `${API_URL}/api/testimonials/featured/`);
        const response = await fetch(`${API_URL}/api/testimonials/featured/`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Featured testimonials data:', data);
          console.log('Is array:', Array.isArray(data));
          console.log('Length:', data.length);
          
          // The featured endpoint returns an array directly, not paginated
          if (Array.isArray(data) && data.length > 0) {
            setTestimonials(data.slice(0, 3));
            console.log('Set testimonials:', data.slice(0, 3));
          } else {
            console.warn('No featured testimonials found');
            setError('No featured testimonials available');
          }
        } else {
          console.error('Failed to fetch testimonials:', response.statusText);
          setError('Failed to load testimonials');
        }
      } catch (error) {
        console.error('Error fetching featured testimonials:', error);
        setError('Error loading testimonials');
      } finally {
        setLoading(false);
        console.log('Loading complete');
      }
    };

    fetchTestimonials();
  }, []);

  const getYouTubeEmbedUrl = (url?: string | null) => {
    if (!url) return '';
    // Convert various YouTube URL formats to embed URL
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?\/\s]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1`;
    }
    return url;
  };

  const handleVideoClick = () => {
    setPlayingVideo(true);
  };

  console.log('Render state - Loading:', loading, 'Testimonials count:', testimonials.length, 'Error:', error);

  if (loading) {
    console.log('Returning null - still loading');
    return null;
  }

  // If no testimonials, don't render the section
  if (testimonials.length === 0) {
    console.log('Returning null - no testimonials');
    return null;
  }

  // Determine which testimonial has video (first one by default)
  const videoTestimonial = testimonials.find(t => t.video_url) || testimonials[0];
  const textTestimonials = testimonials.filter(t => t.id !== videoTestimonial.id).slice(0, 2);
  
  console.log('Rendering testimonials section with:', {
    videoTestimonial: videoTestimonial.name,
    textTestimonials: textTestimonials.map(t => t.name)
  });

  return (
    <section className="bg-[#EADEC9] py-12 sm:py-16 md:py-20 lg:py-24 pb-16 sm:pb-20 md:pb-24 lg:pb-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4 sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Testimonials
          </motion.h2>
          <motion.p 
            className="text-[#7C7A70] max-w-3xl mx-auto text-base sm:text-lg leading-relaxed font-medium px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            I assist my customers in getting to the heart of their real estate demands, desires, 
            and outcomes. I'm in this for the long term.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Video Testimonial Column (5/12) */}
          <motion.div 
            className="lg:col-span-5 relative group cursor-pointer overflow-hidden rounded-sm min-h-[400px] sm:min-h-[500px] lg:h-[578px] shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onClick={handleVideoClick}
          >
            {playingVideo && videoTestimonial.video_url ? (
              /* Video Player */
              <iframe
                src={getYouTubeEmbedUrl(videoTestimonial.video_url)}
                className="w-full h-full min-h-[400px] sm:min-h-[500px]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videoTestimonial.title}
              />
            ) : (
              /* Thumbnail View */
              <>
                <img 
                  src={videoTestimonial.image} 
                  alt="Happy Clients"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6 sm:p-8 md:p-12">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 max-w-xs leading-tight mx-auto px-4">
                      {videoTestimonial.title}
                    </h3>
                    
                    <div className="mb-6 sm:mb-8 w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform mx-auto">
                      <Play size={20} className="sm:w-6 sm:h-6 text-[#34465d] ml-1" fill="currentColor" />
                    </div>

                    <div>
                      <StarRating />
                      <p className="font-bold text-base sm:text-lg">{videoTestimonial.name}</p>
                      <p className="text-xs sm:text-sm opacity-80">{videoTestimonial.role}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Wrapper for the standard testimonials (7/12) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Standard Testimonial Column 1 */}
            {textTestimonials[0] && (
              <motion.div 
                className="bg-white p-6 sm:p-8 flex flex-col shadow-lg rounded-sm min-h-[450px] sm:min-h-[500px] lg:h-[578px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="h-[180px] sm:h-[201px] overflow-hidden mb-6 sm:mb-8 flex-shrink-0 rounded-sm">
                  <img 
                    src={textTestimonials[0].image} 
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mb-4 sm:mb-5 flex-shrink-0">{textTestimonials[0].title}</h3>
                  <p className="text-[#7C7A70] text-sm sm:text-[15px] leading-relaxed mb-6 sm:mb-8 flex-1 overflow-y-auto">
                    {textTestimonials[0].text}
                  </p>
                  
                  <div className="pt-4 sm:pt-6 border-t border-gray-100 mt-auto flex-shrink-0">
                    <StarRating />
                    <p className="font-bold text-[#1a1a1a] text-sm sm:text-base">{textTestimonials[0].name}</p>
                    <p className="text-xs text-[#7C7A70] uppercase tracking-widest">{textTestimonials[0].role}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Standard Testimonial Column 2 */}
            {textTestimonials[1] && (
              <motion.div 
                className="bg-white p-6 sm:p-8 flex flex-col shadow-lg rounded-sm min-h-[450px] sm:min-h-[500px] lg:h-[578px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="h-[180px] sm:h-[201px] overflow-hidden mb-6 sm:mb-8 flex-shrink-0 rounded-sm">
                  <img 
                    src={textTestimonials[1].image} 
                    alt="Luxury Home"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mb-4 sm:mb-5 flex-shrink-0">{textTestimonials[1].title}</h3>
                  <p className="text-[#7C7A70] text-sm sm:text-[15px] leading-relaxed mb-6 sm:mb-8 flex-1 overflow-y-auto">
                    {textTestimonials[1].text}
                  </p>
                  
                  <div className="pt-4 sm:pt-6 border-t border-gray-100 mt-auto flex-shrink-0">
                    <StarRating />
                    <p className="font-bold text-[#1a1a1a] text-sm sm:text-base">{textTestimonials[1].name}</p>
                    <p className="text-xs text-[#7C7A70] uppercase tracking-widest">{textTestimonials[1].role}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
