'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';

interface ContactHeroSettings {
  title: string;
  subtitle: string;
  background_url: string;
}

export default function ContactHero() {
  const [settings, setSettings] = useState<ContactHeroSettings>({
    title: 'Contact Me',
    subtitle: '',
    background_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1920',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.contact.heroSettings);
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const heroData = data.results[0];
            setSettings({
              title: heroData.title || 'Contact Me',
              subtitle: heroData.subtitle || '',
              background_url: heroData.background_url || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1920',
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch contact hero settings:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <section className="relative min-h-[300px] sm:min-h-[347px] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="relative z-10 text-center px-4 sm:px-6 py-8 sm:py-0">
          <div className="h-12 w-48 bg-gray-700 animate-pulse rounded mx-auto mb-6" />
          <div className="h-6 w-32 bg-gray-700 animate-pulse rounded mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[300px] sm:min-h-[347px] flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 text-center px-4 sm:px-6 py-8 sm:py-0">
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 tracking-tight font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {settings.title}
        </motion.h1>
        
        {settings.subtitle && (
          <motion.p
            className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {settings.subtitle}
          </motion.p>
        )}
        
        {/* Breadcrumb Section */}
        <motion.nav 
          className="flex items-center justify-center gap-2 text-white/80 text-sm md:text-base font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight size={16} className="flex-shrink-0" />
          <span className="text-[#c1a478] font-bold">Contact</span>
        </motion.nav>
      </div>
    </section>
  );
}
