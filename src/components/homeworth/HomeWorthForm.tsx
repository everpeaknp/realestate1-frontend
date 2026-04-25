/**
 * SECURE Home Worth / Valuation Form
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
import { Home, Mail, Phone, User, MapPin, DollarSign } from 'lucide-react';
import { homeWorthSchema, type HomeWorthFormData } from '@/lib/validation';
import { sanitizeFormData } from '@/lib/sanitize';
import { rateLimiter, formatTimeRemaining } from '@/lib/rateLimit';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSelect } from '@/components/forms/FormSelect';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { API_ENDPOINTS } from '@/lib/api';

interface HomeWorthFormSettings {
  form_title: string;
  form_description: string;
  submit_button_text: string;
  success_message: string;
  is_active: boolean;
}

export default function HomeWorthForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [rateLimitError, setRateLimitError] = useState('');
  const [propertyImages, setPropertyImages] = useState<File[]>([]);
  const [formSettings, setFormSettings] = useState<HomeWorthFormSettings>({
    form_title: 'Request Your Free Home Valuation',
    form_description: "Fill out the form below and I'll provide you with a comprehensive market analysis of your property.",
    submit_button_text: 'GET FREE VALUATION',
    success_message: "Thank you! Your valuation request has been submitted. We'll contact you shortly.",
    is_active: true,
  });

  useEffect(() => {
    const fetchFormSettings = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.homeworth.formSettings);
        if (response.ok) {
          const data = await response.json();
          // Handle paginated response
          if (data.results && data.results.length > 0) {
            setFormSettings(data.results[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch home worth form settings:', error);
        // Keep default values on error
      }
    };

    fetchFormSettings();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<HomeWorthFormData>({
    resolver: zodResolver(homeWorthSchema),
    mode: 'onBlur',
  });

  const propertyTypeOptions = [
    { value: '', label: 'Select Type' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
  ];

  const onSubmit = async (data: HomeWorthFormData) => {
    setSubmitStatus('idle');
    setErrorMessage('');
    setRateLimitError('');

    // Check honeypot field
    if (data.company) {
      setErrorMessage('Invalid submission detected.');
      setSubmitStatus('error');
      return;
    }

    // Rate limiting check
    const rateLimitKey = `homeworth:${data.email}`;
    if (!rateLimiter.isAllowed(rateLimitKey)) {
      const timeRemaining = rateLimiter.getTimeUntilReset(rateLimitKey);
      setRateLimitError(
        `Too many attempts. Please try again in ${formatTimeRemaining(timeRemaining)}.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize all input data
      const sanitizedData = sanitizeFormData(data);

      // Split name into first and last name
      const nameParts = sanitizedData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', sanitizedData.email);
      formData.append('phone', sanitizedData.phone);
      formData.append('message', sanitizedData.message || 'Home valuation request');
      formData.append('property_type_interest', sanitizedData.propertyType);
      if (sanitizedData.budget) {
        formData.append('budget', sanitizedData.budget);
      }
      formData.append('location', sanitizedData.address);
      formData.append('inquiry_type', 'SELLING');
      formData.append('source', 'VALUATION');

      // Append images
      propertyImages.forEach((file, index) => {
        formData.append(`property_image_${index + 1}`, file);
      });

      console.log('Submitting form with images:', propertyImages.length);

      const response = await fetch(`${apiUrl}/api/leads/valuation/`, {
        method: 'POST',
        // Don't set Content-Type - browser will set it with boundary for FormData
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setPropertyImages([]);
        reset();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Validation errors:', errorData);
        console.error('Response status:', response.status);
        console.error('Response statusText:', response.statusText);
        
        // Extract error message
        let errorMsg = 'Submission failed. Please check your information and try again.';
        if (errorData.message) {
          errorMsg = errorData.message;
        } else if (errorData.detail) {
          errorMsg = errorData.detail;
        } else if (errorData.error) {
          errorMsg = errorData.error;
        } else if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
          // Format field errors
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('; ');
          errorMsg = fieldErrors || errorMsg;
        }
        
        setErrorMessage(errorMsg);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Something went wrong. Please try again or contact us directly.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formSettings.is_active) {
    return null;
  }

  return (
    <section id="valuation-form" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
            {formSettings.form_title}
          </h2>
          <p className="text-lg text-[#7C7A70] max-w-2xl mx-auto">
            {formSettings.form_description}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8 md:p-12"
          noValidate
        >
          {/* Error Messages */}
          {(errorMessage || rateLimitError) && (
            <div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-800 text-sm"
              role="alert"
            >
              {errorMessage || rateLimitError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <FormInput
              label="Full Name"
              type="text"
              {...register('name')}
              error={errors.name}
              icon={<User size={18} />}
              required
              disabled={isSubmitting}
              placeholder="John Doe"
            />

            {/* Email */}
            <FormInput
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email}
              icon={<Mail size={18} />}
              required
              disabled={isSubmitting}
              placeholder="john@example.com"
            />

            {/* Phone */}
            <FormInput
              label="Phone Number"
              type="tel"
              {...register('phone')}
              error={errors.phone}
              icon={<Phone size={18} />}
              required
              disabled={isSubmitting}
              placeholder="+1 (321) 456-7890"
            />

            {/* Property Type */}
            <FormSelect
              label="Property Type"
              {...register('propertyType')}
              error={errors.propertyType}
              icon={<Home size={18} />}
              options={propertyTypeOptions}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Address */}
          <div className="mb-6">
            <FormInput
              label="Property Address"
              type="text"
              {...register('address')}
              error={errors.address}
              icon={<MapPin size={18} />}
              required
              disabled={isSubmitting}
              placeholder="123 Main Street, Boston, MA 02101"
            />
          </div>

          {/* Budget (Optional) */}
          <div className="mb-6">
            <FormInput
              label="Expected Price Range (Optional)"
              type="text"
              {...register('budget')}
              error={errors.budget}
              icon={<DollarSign size={18} />}
              disabled={isSubmitting}
              placeholder="$500,000 - $750,000"
            />
          </div>

          {/* Message */}
          <div className="mb-8">
            <FormTextarea
              label="Additional Information (Optional)"
              {...register('message')}
              error={errors.message}
              rows={4}
              disabled={isSubmitting}
              placeholder="Tell us more about your property or any specific questions you have..."
            />
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <ImageUpload
              maxImages={5}
              maxSizeMB={5}
              onImagesChange={setPropertyImages}
              disabled={isSubmitting}
              label="Property Images (Optional)"
              helperText="Upload up to 5 images of your property to help us provide a more accurate valuation (Max 5MB each)"
            />
          </div>

          {/* Honeypot field - hidden from users, visible to bots */}
          <input
            type="text"
            {...register('company')}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full bg-[#c1a478] hover:bg-[#b09367] text-white px-12 py-4 font-bold text-sm tracking-widest transition-all rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 uppercase disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            aria-label="Submit valuation request"
          >
            {isSubmitting ? 'SUBMITTING...' : formSettings.submit_button_text}
          </button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded-sm text-green-800 text-center"
              role="alert"
            >
              {formSettings.success_message}
            </motion.div>
          )}

          {submitStatus === 'error' && !errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-800 text-center"
              role="alert"
            >
              Something went wrong. Please try again or contact us directly.
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
