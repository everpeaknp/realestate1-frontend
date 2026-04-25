/**
 * SECURE Comment Form
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
import { motion } from 'framer-motion';
import { submitComment } from '@/lib/blogApi';
import { commentSchema, type CommentFormData } from '@/lib/validation';
import { sanitizeFormData } from '@/lib/sanitize';
import { rateLimiter, formatTimeRemaining } from '@/lib/rateLimit';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [rateLimitError, setRateLimitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CommentFormData) => {
    setMessage(null);
    setRateLimitError('');

    // Check honeypot field
    if (data.phone) {
      setMessage({
        type: 'error',
        text: 'Invalid submission detected.',
      });
      return;
    }

    // Rate limiting check
    const rateLimitKey = `comment:${postId}:${data.email}`;
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

      await submitComment({
        post: postId,
        author_name: sanitizedData.name,
        author_email: sanitizedData.email,
        content: sanitizedData.comment,
      });

      setMessage({
        type: 'success',
        text: 'Your comment has been submitted and is awaiting moderation. Thank you!',
      });

      reset();
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to submit comment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3 sm:mb-4 font-sans">
            Leave a Reply
          </h2>
          <p className="text-[#5d6d87] text-sm sm:text-[15px] font-medium">
            Your email address will not be published. Required fields are marked{' '}
            <span className="text-[#c1a478]">*</span>
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 sm:mb-8 p-4 sm:p-5 rounded-sm text-sm sm:text-base ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
            role="alert"
          >
            {message.text}
          </motion.div>
        )}

        {/* Rate Limit Error */}
        {rateLimitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-sm text-sm sm:text-base bg-yellow-50 border border-yellow-200 text-yellow-800"
            role="alert"
          >
            {rateLimitError}
          </motion.div>
        )}

        <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Comment Textarea */}
          <FormTextarea
            label="Comment"
            {...register('comment')}
            error={errors.comment}
            required
            rows={8}
            disabled={isSubmitting}
            placeholder="Share your thoughts..."
            className="min-h-[120px]"
          />

          {/* Name Input */}
          <FormInput
            label="Name"
            type="text"
            {...register('name')}
            error={errors.name}
            required
            disabled={isSubmitting}
            placeholder="John Doe"
          />

          {/* Email Input */}
          <FormInput
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email}
            required
            disabled={isSubmitting}
            placeholder="john@example.com"
          />

          {/* Website Input (Optional) */}
          <FormInput
            label="Website"
            type="url"
            {...register('website')}
            error={errors.website}
            disabled={isSubmitting}
            placeholder="https://yourwebsite.com"
          />

          {/* Honeypot field - hidden from users, visible to bots */}
          <input
            type="text"
            {...register('phone')}
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
          <motion.button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="bg-[#c1a478] hover:bg-[#b09367] text-white px-8 py-4 sm:px-10 sm:py-5 font-bold text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-300 rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px] w-full sm:w-auto"
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            aria-label="Post comment"
          >
            {isSubmitting ? 'Submitting...' : 'Post Comment'}
          </motion.button>
        </form>
      </div>
    </section>
  );
}
