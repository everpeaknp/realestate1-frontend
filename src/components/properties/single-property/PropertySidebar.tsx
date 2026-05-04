'use client';

import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
}

export default function PropertySidebar() {
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    fetch(API_ENDPOINTS.agents.list)
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        // API returns { results: [...] } or plain array
        const list: Agent[] = Array.isArray(json) ? json : (json?.results ?? []);
        if (list.length > 0) setAgent(list[0]);
      })
      .catch(() => {});
  }, []);

  // Fall back to static defaults if no agent in Django yet
  const agentName   = agent?.name   ?? 'Justin Nelson';
  const agentBio    = agent?.bio    ?? 'Investment property specialist';
  const agentAvatar = agent?.avatar ?? '/person.png';
  const agentPhone  = agent?.phone  ?? '0414701721';
  const agentEmail  = agent?.email  ?? 'bijen@lilywhiterealestate.com.au';

  return (
    <aside className="flex flex-col gap-8 w-full">
      {/* Agent Card */}
      <motion.div 
        className="bg-[#FFFBF2] p-6 rounded-sm border border-[#F2E8D5] flex items-center gap-6"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="w-24 h-24 overflow-hidden rounded-sm flex items-center justify-center">
          <img 
            src={agentAvatar}
            alt={agentName}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#1a1a1a] font-sans">{agentName}</h3>
          <p className="text-[#5d6d87] text-sm">{agentBio}</p>
        </div>
      </motion.div>

      {/* Contact Form Card */}
      <motion.div 
        className="bg-[#FFFBF2] p-8 rounded-sm border border-[#F2E8D5]"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-bold text-[#1a1a1a] text-center mb-8 font-sans leading-tight">
          Contact For Your Real Estate Solutions
        </h3>
        
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-[#5d6d87] tracking-wider">Your Name</label>
            <input 
              type="text" 
              className="w-full p-3 bg-white border border-[#E8E8E8] rounded-sm focus:border-[#c1a478] outline-none transition-colors"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-[#5d6d87] tracking-wider">Email Address</label>
            <input 
              type="email" 
              className="w-full p-3 bg-white border border-[#E8E8E8] rounded-sm focus:border-[#c1a478] outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-[#5d6d87] tracking-wider">Phone Number</label>
            <input 
              type="tel" 
              className="w-full p-3 bg-white border border-[#E8E8E8] rounded-sm focus:border-[#c1a478] outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-[#5d6d87] tracking-wider">Message</label>
            <textarea 
              rows={4}
              className="w-full p-3 bg-white border border-[#E8E8E8] rounded-sm focus:border-[#c1a478] outline-none transition-colors resize-none text-sm"
            />
          </div>

          <button className="w-full bg-[#c1a478] text-white font-bold py-4 uppercase tracking-widest text-sm hover:bg-[#b09368] transition-colors mt-2">
            Submit
          </button>
        </form>
      </motion.div>

      {/* Contact Info Card */}
      <motion.div 
        className="bg-[#FFFBF2] p-6 rounded-sm border border-[#F2E8D5] flex flex-col gap-3 items-center"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <a
          href={`tel:${agentPhone}`}
          className="flex items-center gap-3 text-[#5d6d87] hover:text-[#c1a478] transition-colors"
        >
          <Phone size={18} />
          <span className="font-bold text-[#1a1a1a] tracking-tight">{agentPhone}</span>
        </a>
        <a
          href={`mailto:${agentEmail}`}
          className="flex items-center gap-3 text-[#5d6d87] hover:text-[#c1a478] transition-colors"
        >
          <Mail size={18} />
          <span className="font-bold text-[#1a1a1a] tracking-tight">{agentEmail}</span>
        </a>
      </motion.div>
    </aside>
  );
}
