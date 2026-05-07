'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCMS } from '@/contexts/CMSContext';
import { useState, useEffect } from 'react';
import LazyImage from '@/components/shared/LazyImage';


export default function Header() {
  const { headerSettings } = useCMS();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Fallback data while loading or if no data
  const logoImage = headerSettings?.logo_image;
  const logoText = headerSettings?.logo_text || 'Lily White Realestate';
  const phoneNumber = headerSettings?.phone_number || '+1 (321) 456 7890';
  const navLinks = headerSettings?.navigation_links?.filter(link => link.is_active).sort((a, b) => a.order - b.order) || [
    { id: 1, name: 'HOME', href: '/', order: 1, is_active: true },
    { id: 2, name: 'PROPERTIES', href: '/properties', order: 2, is_active: true },
    { id: 3, name: 'SERVICES', href: '/services', order: 3, is_active: true },
    { id: 4, name: 'ABOUT ME', href: '/about', order: 4, is_active: true },
    { id: 5, name: 'BLOG', href: '/blog', order: 5, is_active: true },
    { id: 6, name: 'CONTACT', href: '/contact', order: 6, is_active: true },
  ];

  // Helper function to check if link is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Helper function to ensure absolute URL for images
  const getImageUrl = (url: string | null): string | null => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    return `${process.env.NEXT_PUBLIC_API_URL}/${url}`;
  };

  return (
    <>
      <header className="w-full border-b border-blue-100 bg-white shadow-sm sticky top-0 z-50 transition-shadow duration-300">
        <div className="mx-auto flex h-20 md:h-24 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
            {logoImage ? (
              // Custom uploaded logo
              <div className="relative h-12 sm:h-16 md:h-20 w-auto transition-transform duration-200 group-hover:scale-105">
                <LazyImage 
                  src={getImageUrl(logoImage) || ''} 
                  alt={logoText}
                  className="h-12 sm:h-16 md:h-20 w-auto object-contain"
                  fallbackSrc=""
                />
              </div>
            ) : (
              // Default logo shape with blue theme
              <div className="relative h-8 sm:h-10 w-10 sm:w-12 flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
                {/* Logo Shape */}
                <div className="absolute inset-0 flex">
                  <div 
                    className="w-1/2 h-full bg-gradient-to-br from-blue-600 to-blue-700" 
                    style={{ clipPath: 'polygon(0 0, 100% 40%, 100% 100%, 0% 100%)' }}
                  />
                  <div 
                    className="w-1/2 h-full bg-gradient-to-br from-blue-400 to-blue-500" 
                    style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0% 100%)' }}
                  />
                </div>
                {/* The white house silhouette in the center bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-3 sm:w-4 h-4 sm:h-5 bg-white flex flex-col items-center justify-center rounded-t-sm shadow-md">
                   <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-blue-500 mb-0.5"></div>
                   <div className="flex gap-0.5">
                     <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-blue-100"></div>
                     <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-blue-100"></div>
                   </div>
                </div>
              </div>
            )}
            <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-800 transition-colors duration-200 group-hover:text-blue-600">
              {logoText}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <motion.div key={link.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] transition-all duration-200 cursor-pointer relative ${
                      active 
                        ? 'text-blue-600' 
                        : 'text-slate-700 hover:text-blue-600'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Contact Section - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 text-blue-600 group cursor-pointer">
            <Phone size={18} fill="currentColor" stroke="none" className="opacity-80 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-base lg:text-lg font-bold text-slate-700 tracking-normal transition-colors duration-200 group-hover:text-blue-600">
              {phoneNumber}
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-20 md:top-24 right-0 bottom-0 w-full sm:w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <nav className="flex flex-col p-6 space-y-1">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`block px-4 py-4 text-sm font-bold tracking-wider transition-all duration-200 border-l-4 rounded-r-md cursor-pointer ${
                          active
                            ? 'text-blue-600 bg-blue-50 border-blue-600'
                            : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 border-transparent'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile Contact Info */}
              <div className="p-6 border-t border-blue-100 space-y-4">
                <div className="flex items-center gap-3 text-blue-600 group cursor-pointer">
                  <Phone size={20} fill="currentColor" stroke="none" className="transition-transform duration-200 group-hover:scale-110" />
                  <a href={`tel:${phoneNumber}`} className="text-base font-bold text-slate-700 hover:text-blue-600 transition-colors duration-200">
                    {phoneNumber}
                  </a>
                </div>
                <Link href="/contact">
                  <button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 font-bold text-sm tracking-widest transition-all duration-200 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    CONTACT ME
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
