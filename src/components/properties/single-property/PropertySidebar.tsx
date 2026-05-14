'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import Image from 'next/image';

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  quote: string;
}

export default function PropertySidebar() {
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    fetch(API_ENDPOINTS.agents.list)
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        const list: Agent[] = Array.isArray(json) ? json : (json?.results ?? []);
        if (list.length > 0) setAgent(list[0]);
      })
      .catch(() => {});
  }, []);

  const agentName   = agent?.name   ?? 'Bijen Khadka';
  const agentTitle  = agent?.bio    ?? 'Principal Director';
  const agentQuote  = agent?.quote  ?? "I believe real estate is more than a transaction; it's about finding the space where your life's best moments happen.";
  const agentAvatar = agent?.avatar ?? '/person.png';
  const agentPhone  = agent?.phone  ?? '0414701721';
  const agentEmail  = agent?.email  ?? 'bijen@lilywhiterealestate.com.au';

  const handleBookInspection = () => {
    window.location.href = `tel:${agentPhone}`;
  };

  const handleInquire = () => {
    window.location.href = `mailto:${agentEmail}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-neutral-50 rounded-2xl p-10 lg:sticky lg:top-32 shadow-sm border border-neutral-100"
    >
      {/* Agent info */}
      <div className="flex items-center gap-6 mb-10">
        <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 transition-all hover:scale-105 bg-neutral-100">
          <Image
            src={agentAvatar}
            alt={agentName}
            fill
            sizes="80px"
            quality={70}
            className="object-contain"
          />
        </div>
        <div>
          <h4 className="text-xl font-serif font-medium">{agentName}</h4>
          <p className="text-sm text-neutral-500 font-medium tracking-wide">{agentTitle}</p>
        </div>
      </div>

      {/* Quote */}
      <blockquote className="text-on-surface-variant text-base leading-relaxed italic mb-10 pl-6 border-l-2 border-neutral-200">
        "{agentQuote}"
      </blockquote>

      {/* CTA buttons */}
      <div className="flex flex-col gap-4">
        <motion.button
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBookInspection}
          className="w-full bg-primary text-white py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-neutral-200 cursor-pointer"
        >
          Book Inspection
        </motion.button>

        <motion.button
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleInquire}
          className="w-full border border-neutral-200 bg-white text-primary py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          Inquire Now
        </motion.button>
      </div>
    </motion.div>
  );
}
