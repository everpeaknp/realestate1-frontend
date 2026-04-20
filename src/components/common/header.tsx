'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Phone } from 'lucide-react';


export default function Header() {
  const navLinks = [
    { name: 'HOME', hasDropdown: true },
    { name: 'PROPERTIES', hasDropdown: true },
    { name: 'SINGLE PROPERTY', hasDropdown: false },
    { name: 'SERVICES', hasDropdown: false },
    { name: 'ABOUT ME', hasDropdown: false },
    { name: 'PAGES', hasDropdown: true },
  ];

  return (
    <header className="w-full border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
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
            Realtor Pal
          </span>
        </div>

        {/* Navigation Section */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href="#"
              className="flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] text-[#1a1a1a] hover:text-[#c1a478] transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              {link.name}
              {link.hasDropdown && <ChevronDown size={12} className="mt-0.5 opacity-40" />}
            </motion.a>
          ))}
        </nav>

        {/* Contact Section */}
        <div className="flex items-center gap-2 text-[#c1a478]">
          <Phone size={20} fill="currentColor" stroke="none" className="opacity-80" />
          <span className="text-lg font-bold text-[#34465d] tracking-normal">
            +1 (321) 456 7890
          </span>
        </div>
      </div>
    </header>
  );
}
