'use client';

import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

interface TestimonialItem {
  id: string;
  title: string;
  text: string;
  name: string;
  role: string;
  image: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_URL}/api/testimonials/`);
        if (response.ok) {
          const data = await response.json();
          // Handle paginated response
          setTestimonials(data.results || data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-[#5d6d87]">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12 sm:mb-14 md:mb-16 text-center">
          <motion.span 
            className="text-[#c1a478] font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4 block"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Testimonials
          </motion.span>
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4 sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Our Clients Say
          </motion.h2>
        </div>

        {/* Testimonials Grid - 2 Columns, 3 Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-white p-6 sm:p-8 border border-gray-100 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Image */}
                <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] flex-shrink-0 mx-auto sm:mx-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-[#5d6d87] text-sm sm:text-[15px] leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="sm:w-4 sm:h-4 text-[#f39c12] fill-current" />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-[#1a1a1a] text-base sm:text-lg">{item.name}</p>
                  <p className="text-xs sm:text-sm text-[#5d6d87]">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
