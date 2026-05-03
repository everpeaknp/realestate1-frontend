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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
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
          <h3 className="text-xl font-bold text-[#1a1a1a] font-sans">
            {displayAgent.name}
          </h3>
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
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Error Messages */}
            {(error || rateLimitError) && (
              <div
                className="p-3 bg-red-50 border border-red-200 rounded-sm text-red-800 text-sm"
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
              className="w-full bg-[#c1a478] text-white font-bold py-4 uppercase tracking-widest text-sm hover:bg-[#b09368] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Submit property inquiry"
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
          <span className="font-bold text-[#1a1a1a] tracking-tight">
            {displayAgent.phone}
          </span>
        </a>
        <a
          href={`mailto:${displayAgent.email}`}
          className="flex items-center gap-3 text-[#5d6d87] hover:text-[#c1a478] transition-colors"
        >
          <Mail size={18} />
          <span className="font-bold text-[#1a1a1a] tracking-tight">
            {displayAgent.email}
          </span>
        </a>
      </motion.div>
    </aside>
  );
}
