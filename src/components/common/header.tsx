'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCMS } from '@/contexts/CMSContext';
import { useState, useEffect } from 'react';


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
      <header className="w-full border-b border-gray-100 bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto flex h-20 md:h-24 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {logoImage ? (
              // Custom uploaded logo
              <div className="relative h-12 sm:h-16 md:h-20 w-auto">
                <img 
                  src={getImageUrl(logoImage) || ''} 
                  alt={logoText}
                  className="h-12 sm:h-16 md:h-20 w-auto object-contain"
                  onError={(e) => {
                    console.error('Logo image failed to load:', getImageUrl(logoImage));
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              // Default logo shape
              <div className="relative h-8 sm:h-10 w-10 sm:w-12 flex items-center justify-center flex-shrink-0">
                {/* Logo Shape */}
                <div className="absolute inset-0 flex">
                  <div 
                    className="w-1/2 h-full bg-[#5d6d87]" 
                    style={{ clipPath: 'polygon(0 0, 100% 40%, 100% 100%, 0% 100%)' }}
                  />
                  <div 
                    className="w-1/2 h-full bg-[#c1a478]" 
                    style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0% 100%)' }}
                  />
                </div>
                {/* The white house silhouette in the center bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-3 sm:w-4 h-4 sm:h-5 bg-white flex flex-col items-center justify-center rounded-t-sm shadow-sm">
                   <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-[#c1a478] mb-0.5"></div>
                   <div className="flex gap-0.5">
                     <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-gray-200"></div>
                     <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-gray-200"></div>
                   </div>
                </div>
              </div>
            )}
            <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#1a1a1a]">
              {logoText}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <motion.div key={link.id} whileHover={{ scale: 1.05 }}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] transition-colors ${
                      active 
                        ? 'text-[#c1a478]' 
                        : 'text-[#1a1a1a] hover:text-[#c1a478]'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Contact Section - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 text-[#c1a478]">
            <Phone size={18} fill="currentColor" stroke="none" className="opacity-80" />
            <span className="text-base lg:text-lg font-bold text-[#34465d] tracking-normal">
              {phoneNumber}
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1a1a1a] hover:text-[#c1a478] transition-colors"
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
                        className={`block px-4 py-4 text-sm font-bold tracking-wider transition-colors border-l-4 ${
                          active
                            ? 'text-[#c1a478] bg-[#c1a478]/5 border-[#c1a478]'
                            : 'text-[#1a1a1a] hover:text-[#c1a478] hover:bg-gray-50 border-transparent'
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
              <div className="p-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-3 text-[#c1a478]">
                  <Phone size={20} fill="currentColor" stroke="none" />
                  <a href={`tel:${phoneNumber}`} className="text-base font-bold text-[#34465d] hover:text-[#c1a478] transition-colors">
                    {phoneNumber}
                  </a>
                </div>
                <Link href="/contact">
                  <button 
                    className="w-full bg-[#c1a478] hover:bg-[#b09367] text-white px-6 py-3 font-bold text-sm tracking-widest transition-all rounded-sm shadow-md"
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
