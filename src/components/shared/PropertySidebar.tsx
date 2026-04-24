'use client';

import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cmsAPI } from '@/lib/api';

interface Agent {
  id?: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
}

interface PropertySidebarSettings {
  id: number;
  form_title: string;
  default_agent: Agent | null;
  is_active: boolean;
}

interface PropertySidebarProps {
  agent?: Agent;
  propertySlug?: string;
}

export default function PropertySidebar({ agent, propertySlug }: PropertySidebarProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<PropertySidebarSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Default agent data if none provided
  const defaultAgent = {
    name: 'Justin Nelson',
    email: 'hello@example.com',
    phone: '+1 (321) 456 7890',
    avatar: 'https://www.realtorpal.hocud.com/wp-content/uploads/Realtor-Pal-Main-Agent-pro.png',
    bio: 'Boston Realtor'
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await cmsAPI.getPropertySidebarSettings();
        if (data && data.length > 0) {
          setSettings(data[0]);
        } else {
          // Use default settings if fetch fails
          setSettings({
            id: 1,
            form_title: 'Contact For Your Real Estate Solutions',
            default_agent: null,
            is_active: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch property sidebar settings:', error);
        // Use default settings on error
        setSettings({
          id: 1,
          form_title: 'Contact For Your Real Estate Solutions',
          default_agent: null,
          is_active: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Determine which agent to display: prop > settings default > hardcoded default
  const displayAgent = agent || settings?.default_agent || defaultAgent;
  const formTitle = settings?.form_title || 'Contact For Your Real Estate Solutions';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Split name into first/last
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0] || formData.name;
    const lastName = nameParts.slice(1).join(' ') || '';

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/leads/property-inquiry/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          inquiry_type: 'GENERAL',
          source: 'PROPERTY_INQUIRY',
          subject: propertySlug ? `Inquiry about property: ${propertySlug}` : 'Property Inquiry',
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <aside className="flex flex-col gap-8 w-full">
      {/* Agent Card */}
      <motion.div 
        className="bg-[#FFFBF2] p-6 rounded-sm border border-[#F2E8D5] flex items-center gap-6"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="w-24 h-24 overflow-hidden rounded-sm bg-transparent">
          <img 
            src={displayAgent.avatar} 
            alt={displayAgent.name} 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#1a1a1a] font-sans">{displayAgent.name}</h3>
          <p className="text-[#5d6d87] text-sm">{displayAgent.bio || 'Real Estate Agent'}</p>
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
          {formTitle}
        </h3>

        {submitted ? (
          <div className="text-center py-6">
            <div className="text-[#c1a478] text-4xl mb-3">✓</div>
            <p className="text-[#1a1a1a] font-bold text-lg mb-1">Message Sent!</p>
            <p className="text-[#7C7A70] text-sm">We'll get back to you shortly.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-[#5d6d87] text-sm underline hover:text-[#c1a478] transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-[#5d6d87] tracking-wider">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white border border-[#E8E8E8] rounded-sm focus:border-[#c1a478] outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-[#5d6d87] tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white border border-[#E8E8E8] rounded-sm focus:border-[#c1a478] outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-[#5d6d87] tracking-wider">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-[#E8E8E8] rounded-sm focus:border-[#c1a478] outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-[#5d6d87] tracking-wider">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-3 bg-white border border-[#E8E8E8] rounded-sm focus:border-[#c1a478] outline-none transition-colors resize-none text-sm"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#c1a478] text-white font-bold py-4 uppercase tracking-widest text-sm hover:bg-[#b09368] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
        )}
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
          href={`tel:${displayAgent.phone}`}
          className="flex items-center gap-3 text-[#5d6d87] hover:text-[#c1a478] transition-colors"
        >
          <Phone size={18} />
          <span className="font-bold text-[#1a1a1a] tracking-tight">{displayAgent.phone}</span>
        </a>
        <a
          href={`mailto:${displayAgent.email}`}
          className="flex items-center gap-3 text-[#5d6d87] hover:text-[#c1a478] transition-colors"
        >
          <Mail size={18} />
          <span className="font-bold text-[#1a1a1a] tracking-tight">{displayAgent.email}</span>
        </a>
      </motion.div>
  
    </aside>
  );
}
