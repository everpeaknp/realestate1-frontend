/**
 * SECURE Newsletter Subscription Form
 * ✓ React Hook Form + Zod validation
 * ✓ XSS prevention with sanitization
 * ✓ Rate limiting
 * ✓ Honeypot field for bot detection
 * ✓ CSRF-ready structure
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { cmsAPI } from '@/lib/api';
import { newsletterSchema, type NewsletterFormData } from '@/lib/validation';
import { sanitizeFormData } from '@/lib/sanitize';
import { rateLimiter, formatTimeRemaining } from '@/lib/rateLimit';

interface NewsletterSettings {
  id: number;
  title: string;
  description: string;
  is_active: boolean;
}

export default function NewsletterSection() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<NewsletterSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [rateLimitError, setRateLimitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await cmsAPI.getNewsletterSettings();
        if (data && data.length > 0) {
          setSettings(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch newsletter settings:', error);
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

  const onSubmit = async (data: NewsletterFormData) => {
    setError('');
    setRateLimitError('');

    // Check honeypot field
    if (data.website) {
      setError('Invalid submission detected.');
      return;
    }

    // Rate limiting check
    const rateLimitKey = `newsletter:${data.email}`;
    if (!rateLimiter.isAllowed(rateLimitKey)) {
      const timeRemaining = rateLimiter.getTimeUntilReset(rateLimitKey);
      setRateLimitError(
        `Too many attempts. Please try again in ${formatTimeRemaining(timeRemaining)}.`
      );
      return;
    }

    setSubmitting(true);

    try {
      // Sanitize all input data
      const sanitizedData = sanitizeFormData(data);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/newsletter/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // CSRF token would be added here in production
          // 'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({ email: sanitizedData.email }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Subscription failed');
      }

      setSubmitted(true);
      reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !settings || !settings.is_active) {
    return null;
  }

  return (
    <section className="bg-[#5d6d87] pt-0 pb-12 sm:py-16 md:py-20 w-full overflow-hidden">
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
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-[#c1a478]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="font-bold text-base sm:text-lg">You are subscribed!</p>
                <p className="text-white/70 text-xs sm:text-sm mt-1">
                  Thank you for joining our newsletter.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              className="w-full max-w-2xl flex flex-col sm:flex-row gap-0 shadow-2xl rounded-sm overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="flex-1 flex flex-col">
                <input
                  type="email"
                  placeholder="Email address..."
                  {...register('email')}
                  aria-label="Email address"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`
                    flex-1 bg-[#e0e5eb] px-4 sm:px-6 py-4 sm:py-5 
                    text-sm sm:text-base text-[#1a1a1a] 
                    placeholder:text-[#5d6d87]/60 outline-none 
                    focus:bg-white transition-colors min-h-[48px]
                    ${errors.email ? 'border-2 border-red-500' : ''}
                  `}
                  disabled={submitting}
                />

                {/* Honeypot field - hidden from users, visible to bots */}
                <input
                  type="text"
                  {...register('website')}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                  }}
                  aria-hidden="true"
                />

                {(errors.email || error || rateLimitError) && (
                  <p
                    id="email-error"
                    className="text-red-300 text-xs px-2 pt-1 bg-[#e0e5eb]"
                    role="alert"
                  >
                    {errors.email?.message || error || rateLimitError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !isValid}
                className="bg-[#c1a478] hover:bg-[#b09367] text-white px-6 sm:px-10 py-4 sm:py-5 font-bold text-xs tracking-[0.2em] transition-all uppercase whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
                aria-label="Subscribe to newsletter"
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}
