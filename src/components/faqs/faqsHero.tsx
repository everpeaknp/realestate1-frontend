'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';

interface FaqsHeroSettings {
  id: number;
  title: string;
  subtitle: string;
  background_url: string;
  is_active: boolean;
}

export default function FaqsHero() {
  const [heroSettings, setHeroSettings] = useState<FaqsHeroSettings | null>(null);

  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.faqs.heroSettings);
        const data = await response.json();
        
        // API returns paginated results
        if (data.results && data.results.length > 0) {
          setHeroSettings(data.results[0]);
        }
      } catch (error) {
        console.error('Error fetching faqs hero settings:', error);
      }
    };

    fetchHeroSettings();
  }, []);

  // Default fallback values
  const title = heroSettings?.title || 'Common Queries';
  const subtitle = heroSettings?.subtitle || 'My only purpose is to deliver successful results.';
  const backgroundUrl = heroSettings?.background_url || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1920';

  return (
    <section className="relative h-[347px] flex items-center justify-center overflow-hidden">
      {/* Fixed Background Image */}
      <div 
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url("${backgroundUrl}")`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl font-bold mb-8"
          style={{ color: '#EADEC9' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>

        {/* Breadcrumb Section */}
        <motion.nav 
          className="flex items-center justify-center gap-2 text-white/80 text-sm md:text-base font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight size={16} />
          <span className="text-[#c1a478] font-bold">FAQs</span>
        </motion.nav>
      </div>
    </section>
  );
}
