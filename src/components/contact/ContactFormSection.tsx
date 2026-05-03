/**
 * SECURE Contact Form
 * ✓ React Hook Form + Zod validation
 * ✓ XSS prevention with sanitization
 * ✓ Rate limiting
 * ✓ Honeypot field for bot detection
 * ✓ CSRF-ready structure
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { contactSchema, type ContactFormData } from '@/lib/validation';
import { sanitizeFormData } from '@/lib/sanitize';
import { rateLimiter, formatTimeRemaining } from '@/lib/rateLimit';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSelect } from '@/components/forms/FormSelect';

const INQUIRY_MAP: Record<string, string> = {
  buying: 'BUYING',
  selling: 'SELLING',
  renting: 'RENTING',
  'home-loan': 'HOME_LOAN',
  general: 'GENERAL',
};

interface ContactFormSettings {
  id: number;
  intro_text: string;
  agent_name: string;
  agent_title: string;
  agent_image: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;
  is_active: boolean;
}

interface ContactFormSectionProps {
  settings?: ContactFormSettings;
}

export default function ContactFormSection({
  settings = {
    id: 1,
    intro_text: '',
    agent_name: 'Justin Nelson',
    agent_title: 'Boston Realtor',
    agent_image:
      'https://www.realtorpal.hocud.com/wp-content/uploads/Realtor-Pal-Main-Agent-pro.png',
    facebook_url: '#',
    twitter_url: '#',
    instagram_url: '#',
    linkedin_url: '#',
    is_active: true,
  },
}: ContactFormSectionProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [rateLimitError, setRateLimitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      inquiry_type: 'buying',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setError('');
    setRateLimitError('');

    // Check honeypot field
    if (data.fax) {
      setError('Invalid submission detected.');
      return;
    }

    // Rate limiting check
    const rateLimitKey = `contact:${data.email}`;
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
      const res = await fetch(`${apiUrl}/api/leads/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // CSRF token would be added here in production
          // 'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({
          first_name: sanitizedData.first_name,
          last_name: sanitizedData.last_name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          inquiry_type: INQUIRY_MAP[sanitizedData.inquiry_type] || 'GENERAL',
          location: sanitizedData.location,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
          source: 'CONTACT_FORM',
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
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again or call us directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const socialLinks = [
    { Icon: FaFacebookF, href: settings.facebook_url },
    { Icon: FaTwitter, href: settings.twitter_url },
    { Icon: FaInstagram, href: settings.instagram_url },
    { Icon: FaLinkedinIn, href: settings.linkedin_url },
  ];

  const inquiryOptions = [
    { value: 'buying', label: 'Buying' },
    { value: 'selling', label: 'Selling' },
    { value: 'renting', label: 'Renting' },
    { value: 'home-loan', label: 'Home Loan' },
    { value: 'general', label: 'General' },
  ];

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row shadow-2xl rounded-sm overflow-hidden">
          {/* Left Column - Agent Info & Image */}
          <div className="w-full lg:w-[40%] bg-[#fdfaf3] p-8 sm:p-10 lg:p-12 pb-0 flex flex-col items-center">
            <div className="text-center mb-8 w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2 px-4 break-words">
                {settings.agent_name}{' '}
                <span className="text-[#d4af37] mx-2">|</span> {settings.agent_title}
              </h2>

              {/* Social Icons */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6">
                {socialLinks.map(({ Icon, href }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    aria-label={`Social media link ${idx + 1}`}
                    className="w-11 h-11 sm:w-12 sm:h-12 bg-[#5d6d87] rounded-sm flex items-center justify-center text-white hover:bg-[#c1a478] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Icon size={18} className="sm:w-5 sm:h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Agent Image */}
            <div className="mt-auto w-full flex justify-center">
              <img
                src={settings.agent_image}
                alt={settings.agent_name}
                className="w-full max-w-[350px] sm:max-w-[450px] lg:max-w-[500px] h-auto object-contain object-bottom"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="w-full lg:w-[60%] bg-white p-8 sm:p-10 lg:p-12 xl:p-16 pb-0 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 sm:py-16 lg:py-20">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#c1a478]/10 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-[#c1a478]"
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
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-3">
                  Message Sent!
                </h3>
                <p className="text-sm sm:text-base text-[#5d6d87] mb-8 px-4">
                  Thank you for reaching out. We will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full sm:w-auto py-3 px-8 bg-[#c1a478] hover:bg-[#b09367] text-white font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 rounded-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                className="space-y-5 sm:space-y-6 flex flex-col flex-1"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {/* Error Messages */}
                {(error || rateLimitError) && (
                  <div
                    className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-800 text-sm"
                    role="alert"
                  >
                    {error || rateLimitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <FormInput
                    label="First Name"
                    type="text"
                    {...register('first_name')}
                    error={errors.first_name}
                    required
                    disabled={submitting}
                    placeholder="John"
                  />

                  <FormInput
                    label="Last Name"
                    type="text"
                    {...register('last_name')}
                    error={errors.last_name}
                    disabled={submitting}
                    placeholder="Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <FormSelect
                    label="Inquiry Reason"
                    {...register('inquiry_type')}
                    error={errors.inquiry_type}
                    options={inquiryOptions}
                    disabled={submitting}
                  />

                  <FormInput
                    label="Your Location"
                    type="text"
                    {...register('location')}
                    error={errors.location}
                    disabled={submitting}
                    placeholder="Boston, MA"
                  />
                </div>

                <FormInput
                  label="Subject"
                  type="text"
                  {...register('subject')}
                  error={errors.subject}
                  disabled={submitting}
                  placeholder="How can we help you?"
                />

                <FormTextarea
                  label="Message"
                  {...register('message')}
                  error={errors.message}
                  required
                  rows={6}
                  disabled={submitting}
                  placeholder="Tell us more about your needs..."
                />

                {/* Honeypot field - hidden from users, visible to bots */}
                <input
                  type="text"
                  {...register('fax')}
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

                <div className="flex-1"></div>

                <button
                  type="submit"
                  disabled={submitting || !isValid}
                  className="w-full py-4 sm:py-5 bg-[#c1a478] hover:bg-[#b09367] text-white font-bold text-sm sm:text-base tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:shadow-lg rounded-none transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none min-h-[52px] sm:min-h-[56px]"
                  aria-label="Submit contact form"
                >
                  {submitting ? 'Sending...' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
