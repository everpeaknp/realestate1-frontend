'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCMS } from '@/contexts/CMSContext';
import { useState, useEffect } from 'react';


export default function Header() {
  const { headerSettings } = useCMS();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === '/';

  // Handle scroll for transparent -> solid transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Static brand identity
  const logoText = 'Bijen Khadka';
  const logoSrc = '/icon.png';
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

  // Dynamic Styles
  const isTransparent = isHome && !scrolled && !mobileMenuOpen;
  const headerBaseClass = "w-full fixed top-0 z-[100] transition-all duration-500 ease-in-out";
  const headerThemeClass = isTransparent 
    ? "bg-transparent border-transparent text-white" 
    : "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm text-black";

  return (
    <>
      <header className={`${headerBaseClass} ${headerThemeClass}`}>
        <div className="mx-auto flex h-20 md:h-24 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
            <div className="h-12 sm:h-16 md:h-20 w-12 sm:w-16 md:w-20 transition-transform duration-200 group-hover:scale-105">
              <Image
                src={logoSrc}
                alt={logoText}
                width={80}
                height={80}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <span className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 ${isTransparent ? 'text-white' : 'text-black'}`}>
              {logoText}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = link.href;
                  }}
                  className={`flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] transition-colors duration-500 cursor-pointer relative no-underline ${
                    active 
                      ? (isTransparent ? 'text-white' : 'text-black')
                      : (isTransparent ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-black')
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.div
                      style={{ backgroundColor: isTransparent ? '#FFFFFF' : '#000000' }}
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Contact Section - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 group cursor-pointer">
            <Phone size={18} fill="currentColor" stroke="none" className={`transition-all duration-500 ${isTransparent ? 'text-white' : 'text-black'}`} />
            <span className={`text-base lg:text-lg font-bold tracking-normal transition-colors duration-500 ${isTransparent ? 'text-white/90 group-hover:text-white' : 'text-gray-700 group-hover:text-black'}`}>
              {phoneNumber}
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors duration-500 cursor-pointer ${isTransparent ? 'text-white' : 'text-black'}`}
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
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        window.location.href = link.href;
                      }}
                      className={`block px-4 py-4 text-sm font-bold tracking-wider transition-colors duration-200 border-l-4 rounded-r-md cursor-pointer no-underline ${
                        active
                          ? 'bg-[rgba(0,0,0,0.05)] border-[#000000]'
                          : 'text-slate-700 hover:bg-[rgba(0,0,0,0.03)] border-transparent hover:text-[#000000]'
                      }`}
                      style={active ? { color: '#000000' } : {}}
                    >
                      {link.name}
                    </a>
                  );
                })}
              </nav>

              {/* Mobile Contact Info */}
              <div className="p-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <Phone size={20} fill="currentColor" stroke="none" style={{ color: '#000000' }} className="transition-transform duration-200 group-hover:scale-110" />
                  <a href={`tel:${phoneNumber}`} className="text-base font-bold text-slate-700 transition-colors duration-200 hover:text-[#000000]">
                    {phoneNumber}
                  </a>
                </div>
                <Link href="/contact">
                  <button 
                    style={{ background: '#000000' }}
                    className="w-full hover:opacity-90 text-white px-6 py-3 font-bold text-sm tracking-widest transition-all duration-200 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
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
