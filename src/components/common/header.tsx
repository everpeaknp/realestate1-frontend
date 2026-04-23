'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Phone } from 'lucide-react';
import Link from 'next/link';


export default function Header() {
  const navLinks = [
    { name: 'HOME', href: '/', hasDropdown: false },
    { name: 'PROPERTIES', href: '/properties', hasDropdown: false },
    { name: 'SERVICES', href: '/services', hasDropdown: false },
    { name: 'ABOUT ME', href: '/about', hasDropdown: false },
    { name: 'BLOG', href: '/blog', hasDropdown: false },
    { name: 'CONTACT', href: '/contact', hasDropdown: false },
  ];

  return (
    <header className="w-full border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-12 flex items-center justify-center">
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
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-4 h-5 bg-white flex flex-col items-center justify-center rounded-t-sm shadow-sm">
               <div className="w-1 h-1 bg-[#c1a478] mb-0.5"></div>
               <div className="flex gap-0.5">
                 <div className="w-1 h-1 bg-gray-200"></div>
                 <div className="w-1 h-1 bg-gray-200"></div>
               </div>
            </div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
            Lily White Realestate
          </span>
        </Link>

        {/* Navigation Section */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <motion.div key={link.name} whileHover={{ scale: 1.02 }}>
              <Link
                href={link.href}
                className="flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] text-[#1a1a1a] hover:text-[#c1a478] transition-colors"
              >
                {link.name}
                {link.hasDropdown && <ChevronDown size={12} className="mt-0.5 opacity-40" />}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Contact Section */}
        <div className="flex items-center gap-2 text-[#c1a478]">
          <Phone size={20} fill="currentColor" stroke="none" className="opacity-80" />
          <span className="text-lg font-bold text-[#34465d] tracking-normal">
            0414701721
          </span>
        </div>
      </div>
    </header>
  );
}
