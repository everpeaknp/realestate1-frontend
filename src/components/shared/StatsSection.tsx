'use client';

import { Crown, Users, MapPinned, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  {
    icon: Crown,
    label: '12+ Years of Experience',
  },
  {
    icon: Users,
    label: '1500+ Satisfied Clients',
  },
  {
    icon: MapPinned,
    label: '24 Locations Covered',
  },
  {
    icon: Star,
    label: '100+ Five Star Ratings',
  },
];

export default function StatsSection() {
  return (
    <section className="bg-[#586C89] w-full pt-0 pb-0 text-white overflow-hidden px-6 md:px-12 lg:px-20">
      <div className="grid grid-cols-4 mx-auto relative" style={{ maxWidth: '1520px', height: '181px' }}>
        {stats.map((stat, index) => (
          <div key={stat.label} className="relative h-[181px]">
            {/* Left border for first item */}
            {index === 0 && (
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/30 z-20" />
            )}
            
            {/* Right border for all items */}
            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/30 z-20" />
            
            <div className="h-full [perspective:1200px]">
            <motion.div
              className="relative w-full h-full cursor-pointer origin-center"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{ rotateX: 90 }} // Rolls from front down to reveal the face below
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Front Face: Conceptually "Part of the Circle" animation wise */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center p-8 gap-6 text-center bg-[#586C89] [backface-visibility:hidden]"
                style={{ 
                  transform: "translateZ(90.5px)", // 90.5px is half the height (181px)
                  WebkitBackfaceVisibility: "hidden" 
                }}
              >
                {/* Brand Elements in original layout */}
                <div className="text-[#ece6d9]">
                  <stat.icon size={36} strokeWidth={1} fill="currentColor" fillOpacity={0.2} />
                </div>
                <h3 className="text-base md:text-lg font-bold tracking-tight px-4 leading-snug text-white">
                  {stat.label}
                </h3>
              </div>

              {/* Bottom Face (Rotating Up to Front) */}
              <div 
                className="absolute inset-0 w-full h-full bg-[#586C89] px-10 flex flex-col items-center justify-center text-center [backface-visibility:hidden]"
                style={{ 
                  transform: "rotateX(-90deg) translateZ(90.5px)", 
                  WebkitBackfaceVisibility: "hidden" 
                }}
              >
                <p className="text-sm md:text-[15px] leading-relaxed text-[#ece6d9] italic font-medium max-w-[240px]">
                  Nullam id dolor id nibh ultricies vehicula ut id elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                </p>
              </div>
            </motion.div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}



