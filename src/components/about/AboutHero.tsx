'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { apiRequest, API_ENDPOINTS } from '@/lib/api';

interface AboutHeroSettings {
  title: string;
  subtitle: string;
  background_url: string;
}

export default function AboutHero() {
  const [settings, setSettings] = useState<AboutHeroSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiRequest<{ results: AboutHeroSettings[] }>(
          API_ENDPOINTS.about.heroSettings
        );
        
        if (response.results && response.results.length > 0) {
          setSettings(response.results[0]);
        }
      } catch (error) {
        console.error('Failed to fetch about hero settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Default values while loading or if fetch fails
  const title = settings?.title || "Hello, I'm Justin Nelson";
  const subtitle = settings?.subtitle || "Boston's most acceptable realtor you can trust.";
  const backgroundUrl = settings?.background_url || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1920';

  if (loading) {
    return (
      <section className="relative min-h-[300px] sm:min-h-[347px] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="text-white">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[300px] sm:min-h-[347px] flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 text-center px-4 sm:px-6 py-8 sm:py-0">
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>
        
        <motion.p 
          className="text-base sm:text-lg md:text-xl font-bold mb-6 sm:mb-8"
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
          <ChevronRight size={16} className="flex-shrink-0" />
          <span className="text-[#c1a478] font-bold">About</span>
        </motion.nav>
      </div>
    </section>
  );
}
