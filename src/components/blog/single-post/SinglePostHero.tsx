'use client';

import { motion } from 'framer-motion';
interface SinglePostHeroProps {
  title?: string;
  author?: string;
  date?: string;
  comments?: string;
  backgroundImage?: string;
}

export default function SinglePostHero({
  title = "Solve the ultimate small space dilemmas",
  author = "Hocud",
  date = "October 10, 2022",
  comments = "No Comments",
  backgroundImage = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1920"
}: SinglePostHeroProps) {
  // Use fallback image if backgroundImage is empty or null
  const heroImage = backgroundImage && backgroundImage.trim() !== '' 
    ? backgroundImage 
    : "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1920";

  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax effect */}
      <div 
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-[1.1] tracking-tight font-sans"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>

        {/* Post Meta Info */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm md:text-base font-medium text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span>{author}</span>
          <span className="w-px h-3 bg-white/40 hidden md:block" />
          <span>{date}</span>
          <span className="w-px h-3 bg-white/40 hidden md:block" />
          <span>{comments}</span>
        </motion.div>
      </div>
    </section>
  );
}
