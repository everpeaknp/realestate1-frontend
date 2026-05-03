'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '@/lib/api';

interface HomeWorthHeroSettings {
  title: string;
  subtitle: string;
  background_url: string;
  is_active: boolean;
}

export default function HomeWorthHero() {
  const [settings, setSettings] = useState<HomeWorthHeroSettings>({
    title: "What's My Home Worth?",
    subtitle: 'Get a free, accurate valuation of your property',
    background_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1920',
    is_active: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.homeworth.heroSettings);
        if (response.ok) {
          const data = await response.json();
          // Handle paginated response
          if (data.results && data.results.length > 0) {
            setSettings(data.results[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch home worth hero settings:', error);
        // Keep default values on error
      }
    };

    fetchSettings();
  }, []);

  if (!settings.is_active) {
    return null;
  }

  return (
    <section className="relative h-[347px] flex items-center justify-center overflow-hidden">
      {/* Fixed Background Image */}
      <div 
        className="absolute inset-0 bg-fixed bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url("${settings.background_url}")`,
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
          {settings.title}
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl font-bold italic mb-8"
          style={{ color: '#EADEC9' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {settings.subtitle}
        </motion.p>

        {/* Breadcrumb Section */}
        <motion.nav 
          className="flex items-center justify-center gap-2 text-white/80 text-sm md:text-base font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <ChevronRight size={16} />
          <span className="text-[#c1a478] font-bold">Home Worth</span>
        </motion.nav>
      </div>
    </section>
  );
}
