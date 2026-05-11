/**
 * SECURE Property Sidebar Form
 * ✓ React Hook Form + Zod validation
 * ✓ XSS prevention with sanitization
 * ✓ Rate limiting
 * ✓ Honeypot field for bot detection
 * ✓ CSRF-ready structure
 */

'use client';

import { Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cmsAPI } from '@/lib/api';
import { propertyInquirySchema, type PropertyInquiryFormData } from '@/lib/validation';
import { sanitizeFormData } from '@/lib/sanitize';
import { rateLimiter, formatTimeRemaining } from '@/lib/rateLimit';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import LazyImage from '@/components/shared/LazyImage';

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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [rateLimitError, setRateLimitError] = useState('');
  const [settings, setSettings] = useState<PropertySidebarSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<PropertyInquiryFormData>({
    resolver: zodResolver(propertyInquirySchema),
    mode: 'onBlur',
  });

  // Default agent data if none provided
  const defaultAgent = {
    name: 'Justin Nelson',
    email: 'hello@example.com',
    phone: '+1 (321) 456 7890',
    avatar:
      'https://www.realtorpal.hocud.com/wp-content/uploads/Realtor-Pal-Main-Agent-pro.png',
    bio: 'Boston Realtor',
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await cmsAPI.getPropertySidebarSettings();
        if (data && data.length > 0) {
          setSettings(data[0]);
        } else {
          setSettings({
            id: 1,
            form_title: 'Contact For Your Real Estate Solutions',
            default_agent: null,
            is_active: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch property sidebar settings:', error);
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

  // Debug logging
  console.log('PropertySidebar - Agent prop:', agent);
  console.log('PropertySidebar - Settings default agent:', settings?.default_agent);
  console.log('PropertySidebar - Display agent:', displayAgent);
  console.log('PropertySidebar - Avatar URL:', displayAgent.avatar);

  const onSubmit = async (data: PropertyInquiryFormData) => {
    setError('');
    setRateLimitError('');

    // Check honeypot field
    if (data.address) {
      setError('Invalid submission detected.');
      return;
    }

    // Rate limiting check
    const rateLimitKey = `property-inquiry:${data.email}`;
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

      // Split name into first/last
      const nameParts = sanitizedData.name.trim().split(' ');
      const firstName = nameParts[0] || sanitizedData.name;
      const lastName = nameParts.slice(1).join(' ') || '';

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/leads/property-inquiry/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // CSRF token would be added here in production
          // 'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          message: sanitizedData.message,
          inquiry_type: 'GENERAL',
          source: 'PROPERTY_INQUIRY',
          subject: propertySlug
            ? `Inquiry about property: ${propertySlug}`
            : 'Property Inquiry',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Submission failed');
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

  if (loading) {
    return null;
  }

  return (
    <aside className="flex flex-col gap-8 w-full">
      {/* Agent Card */}
      <motion.div
        className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-100 flex items-center gap-6 shadow-sm"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="w-24 h-24 overflow-hidden rounded-lg bg-transparent ring-2 ring-gray-100">
          <LazyImage
            src={displayAgent.avatar || defaultAgent.avatar}
            alt={displayAgent.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 font-sans">
            {displayAgent.name}
          </h3>
          <p className="text-slate-600 text-sm">{displayAgent.bio || 'Real Estate Agent'}</p>
        </div>
      </motion.div>

      {/* Contact Form Card */}
      <motion.div
        className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg border border-gray-100 shadow-sm"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-bold text-slate-800 text-center mb-8 font-sans leading-tight">
          {formTitle}
        </h3>

        {submitted ? (
          <div className="text-center py-6">
            <div style={{ color: '#000000' }} className="text-4xl mb-3">✓</div>
            <p className="text-slate-800 font-bold text-lg mb-1">Message Sent!</p>
            <p className="text-slate-600 text-sm">We'll get back to you shortly.</p>
            <button
              onClick={() => setSubmitted(false)}
              style={{ color: '#000000' }}
              className="mt-4 text-sm underline hover:opacity-80 transition-colors duration-200 cursor-pointer"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Error Messages */}
            {(error || rateLimitError) && (
              <div
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
                role="alert"
              >
                {error || rateLimitError}
              </div>
            )}

            <FormInput
              label="Your Name"
              type="text"
              {...register('name')}
              error={errors.name}
              required
              disabled={submitting}
              placeholder="John Doe"
            />

            <FormInput
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email}
              required
              disabled={submitting}
              placeholder="john@example.com"
            />

            <FormInput
              label="Phone Number"
              type="tel"
              {...register('phone')}
              error={errors.phone}
              disabled={submitting}
              placeholder="+1 (321) 456-7890"
            />

            <FormTextarea
              label="Message"
              {...register('message')}
              error={errors.message}
              required
              rows={4}
              disabled={submitting}
              placeholder="I'm interested in this property..."
            />

            {/* Honeypot field - hidden from users, visible to bots */}
            <input
              type="text"
              {...register('address')}
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

            <button
              type="submit"
              disabled={submitting || !isValid}
              style={{ background: '#000000' }}
              className="w-full hover:opacity-90 text-white font-bold py-4 uppercase tracking-widest text-sm transition-all duration-200 rounded-lg shadow-md hover:shadow-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Submit property inquiry"
            >
              {submitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
        )}
      </motion.div>

      {/* Contact Info Card */}
      <motion.div
        className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-100 flex flex-col gap-3 items-center shadow-sm"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <a
          href={`tel:${displayAgent.phone}`}
          style={{ color: '#000000' }}
          className="flex items-center gap-3 hover:opacity-80 transition-colors duration-200 cursor-pointer"
        >
          <Phone size={18} />
          <span className="font-bold text-slate-800 tracking-tight">
            {displayAgent.phone}
          </span>
        </a>
        <a
          href={`mailto:${displayAgent.email}`}
          style={{ color: '#000000' }}
          className="flex items-center gap-3 hover:opacity-80 transition-colors duration-200 cursor-pointer"
        >
          <Mail size={18} />
          <span className="font-bold text-slate-800 tracking-tight">
            {displayAgent.email}
          </span>
        </a>
      </motion.div>
    </aside>
  );
}
