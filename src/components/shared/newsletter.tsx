'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cmsAPI } from '@/lib/api';

interface NewsletterSettings {
  id: number;
  title: string;
  description: string;
  is_active: boolean;
}

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<NewsletterSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await cmsAPI.getNewsletterSettings();
        if (data && data.length > 0) {
          setSettings(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch newsletter settings:', error);
        // Use default values if fetch fails
        setSettings({
          id: 1,
          title: 'Subscribe to my newsletter',
          description: 'Get the most recent information on real estate.',
          is_active: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/newsletter/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) throw new Error('Subscription failed');
      setSubmitted(true);
      setEmail('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Don't render if settings are not active or still loading
  if (loading) {
    return null;
  }

  if (!settings || !settings.is_active) {
    return null;
  }

  return (
    <section className="bg-[#5d6d87] py-12 sm:py-16 md:py-20 w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-20">

          {/* Text Content */}
          <motion.div
            className="text-white text-center lg:text-left flex-shrink-0 w-full lg:w-auto"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold mb-3 sm:mb-4">
              {settings.title}
            </h2>
            <p className="text-white/80 text-sm sm:text-base md:text-lg">
              {settings.description}
            </p>
          </motion.div>

          {/* Form */}
          {submitted ? (
            <motion.div
              className="w-full max-w-2xl flex items-center justify-center bg-white/10 px-6 sm:px-8 py-5 sm:py-6 rounded-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center text-white">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-[#c1a478]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="font-bold text-base sm:text-lg">You are subscribed!</p>
                <p className="text-white/70 text-xs sm:text-sm mt-1">Thank you for joining our newsletter.</p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              className="w-full max-w-2xl flex flex-col sm:flex-row gap-0 shadow-2xl rounded-sm overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
            >
              <div className="flex-1 flex flex-col">
                <input
                  type="email"
                  placeholder="Email address..."
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="flex-1 bg-[#e0e5eb] px-4 sm:px-6 py-4 sm:py-5 text-sm sm:text-base text-[#1a1a1a] placeholder:text-[#5d6d87]/60 outline-none focus:bg-white transition-colors min-h-[48px]"
                  required
                />
                {error && (
                  <p className="text-red-300 text-xs px-2 pt-1 bg-[#e0e5eb]">{error}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#c1a478] hover:bg-[#b09367] text-white px-6 sm:px-10 py-4 sm:py-5 font-bold text-xs tracking-[0.2em] transition-all uppercase whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
              >
                {submitting ? '...' : 'Subscribe'}
              </button>
            </motion.form>
          )}

        </div>
      </div>
    </section>
  );
}
