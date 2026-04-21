'use client';

import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
 

const testimonials = [
  {
    name: 'Ron Lincoln',
    role: 'Happy Seller',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200',
  },
  {
    name: 'Cathy Cooper',
    role: 'Happy Buyer',
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80&w=1200',
  }
];

export default function VideoTestimonials() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              className="relative aspect-[16/9] rounded-sm overflow-hidden group cursor-pointer shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Background Image */}
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/50" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-8 tracking-tight px-4 font-sans">
                  Video testimonials from our happy clients
                </h3>

                {/* Play Button */}
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg transition-transform duration-500 group-hover:scale-110">
                  <Play size={24} className="text-[#1a1a1a] fill-current ml-1" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-[#f1c40f] fill-current" />
                  ))}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold tracking-tight">{item.name}</span>
                  <span className="text-sm text-white/80 font-medium uppercase tracking-widest">{item.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
