'use client';

import { Phone, Mail, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCMS } from '@/contexts/CMSContext';

// Custom Social Media Icons as SVG components
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-[18px] sm:h-[18px]">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-[18px] sm:h-[18px]">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-[18px] sm:h-[18px]">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-[18px] sm:h-[18px]">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function Footer() {
  const { footerSettings } = useCMS();
  const pathname = usePathname();

  // Fallback data while loading or if no data
  const logoImage = footerSettings?.logo_image;
  const logoText = footerSettings?.logo_text || 'Lily White Realestate';
  const phoneNumber = footerSettings?.phone_number || '+1 (321) 456 7890';
  const email = footerSettings?.email || 'hello@example.com';
  const copyrightText = footerSettings?.copyright_text || '2026 Lily White Realestate. All rights reserved.';
  
  const footerLinks = footerSettings?.footer_links?.filter(link => link.is_active).sort((a, b) => a.order - b.order) || [
    { id: 1, name: "What's My Home Worth?", href: '/home-worth', order: 1, is_active: true },
    { id: 2, name: 'Testimonials', href: '/testimonials', order: 2, is_active: true },
    { id: 3, name: 'FAQs', href: '/faqs', order: 3, is_active: true },
    { id: 4, name: 'Projects', href: '/projects', order: 4, is_active: true },
    { id: 5, name: 'Terms & Conditions', href: '#', order: 5, is_active: true },
    { id: 6, name: 'Privacy Policy', href: '#', order: 6, is_active: true },
  ];

  // Helper function to check if link is active
  const isActive = (href: string) => {
    if (href === '#') return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const socialLinks = [
    { 
      icon: <FacebookIcon />, 
      href: footerSettings?.facebook_url || '#', 
      label: 'Facebook',
      show: !!footerSettings?.facebook_url 
    },
    { 
      icon: <TwitterIcon />, 
      href: footerSettings?.twitter_url || '#', 
      label: 'Twitter',
      show: !!footerSettings?.twitter_url 
    },
    { 
      icon: <InstagramIcon />, 
      href: footerSettings?.instagram_url || '#', 
      label: 'Instagram',
      show: !!footerSettings?.instagram_url 
    },
    { 
      icon: <LinkedInIcon />, 
      href: footerSettings?.linkedin_url || '#', 
      label: 'LinkedIn',
      show: !!footerSettings?.linkedin_url 
    },
  ].filter(social => social.show || !footerSettings);

  return (
    <footer className="bg-white pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 md:pb-10 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Top Section: Logo, Contact, Socials */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 sm:gap-10 lg:gap-6 pb-12 sm:pb-14 md:pb-16">
          
          {/* Logo Section */}
          <motion.div 
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {logoImage ? (
              <div className="relative h-8 sm:h-10 w-auto">
                <Image 
                  src={logoImage} 
                  alt={logoText}
                  width={120}
                  height={40}
                  className="h-8 sm:h-10 w-auto object-contain"
                />
              </div>
            ) : (
              <div className="relative h-8 sm:h-10 w-10 sm:w-12 flex items-center justify-center flex-shrink-0">
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
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-3 sm:w-4 h-4 sm:h-5 bg-white flex flex-col items-center justify-center rounded-t-sm shadow-sm">
                   <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-[#c1a478] mb-0.5"></div>
                   <div className="flex gap-0.5">
                     <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-gray-200"></div>
                     <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-gray-200"></div>
                   </div>
                </div>
              </div>
            )}
            <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a1a]">
              {logoText}
            </span>
          </motion.div>

          {/* Contact Details */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <a 
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="flex items-center gap-2 sm:gap-3 text-[#c1a478] hover:text-[#5d6d87] transition-colors group"
            >
              <Phone size={16} fill="currentColor" stroke="none" className="rotate-3 sm:w-[18px] sm:h-[18px] group-hover:rotate-6 transition-transform" />
              <span className="text-base sm:text-lg font-bold text-[#5d6d87]">{phoneNumber}</span>
            </a>
            <a 
              href={`mailto:${email}`}
              className="flex items-center gap-2 sm:gap-3 text-[#c1a478] hover:text-[#5d6d87] transition-colors group"
            >
              <Mail size={16} className="sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
              <span className="text-base sm:text-lg font-bold text-[#5d6d87]">{email}</span>
            </a>
          </motion.div>

          {/* Social Icons */}
          {socialLinks.length > 0 && (
            <motion.div 
              className="flex items-center gap-2 sm:gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-[#5d6d87] text-white flex items-center justify-center rounded-sm hover:bg-[#c1a478] transition-colors shadow-sm"
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={social.label}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          )}
        </div>

        {/* Bottom Section: Links and Copyright */}
        <div className="pt-6 sm:pt-8 md:pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          
          {/* Footer Links */}
          <motion.div 
            className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-wrap justify-center md:justify-start"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {footerLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link 
                  key={link.id}
                  href={link.href} 
                  className={`group flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-colors ${
                    active 
                      ? 'text-[#c1a478]' 
                      : 'text-[#5d6d87] hover:text-[#c1a478]'
                  }`}
                >
                  <ChevronRight 
                    size={12} 
                    className={`sm:w-[14px] sm:h-[14px] transition-all ${
                      active 
                        ? 'text-[#c1a478]' 
                        : 'text-gray-300 group-hover:text-[#c1a478] group-hover:translate-x-0.5'
                    }`}
                  />
                  <span className="whitespace-nowrap">{link.name}</span>
                </Link>
              );
            })}
          </motion.div>
          
          {/* Copyright */}
          <motion.div 
            className="text-xs sm:text-sm font-medium text-[#5d6d87] text-center md:text-right"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-base sm:text-lg mr-1">©</span> {copyrightText}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
