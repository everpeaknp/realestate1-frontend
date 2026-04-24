'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitComment } from '@/lib/blogApi';

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await submitComment({
        post: postId,
        author_name: formData.name,
        author_email: formData.email,
        content: formData.comment,
      });

      setMessage({
        type: 'success',
        text: 'Your comment has been submitted and is awaiting moderation. Thank you!',
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        website: '',
        comment: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to submit comment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3 sm:mb-4 font-sans">
            Leave a Reply
          </h2>
          <p className="text-[#5d6d87] text-sm sm:text-[15px] font-medium">
            Your email address will not be published. Required fields are marked <span className="text-[#c1a478]">*</span>
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
          >
            {message.text}
          </motion.div>
        )}

        <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
          {/* Comment Textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-bold text-[#5d6d87] tracking-wide">
              Comment <span className="text-[#c1a478]">*</span>
            </label>
            <textarea 
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white border border-gray-200 focus:border-[#c1a478] outline-none transition-all duration-300 rounded-sm resize-none shadow-sm text-sm sm:text-base min-h-[120px]"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-bold text-[#5d6d87] tracking-wide">
              Name <span className="text-[#c1a478]">*</span>
            </label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white border border-gray-200 focus:border-[#c1a478] outline-none transition-all duration-300 rounded-sm shadow-sm text-sm sm:text-base min-h-[48px]"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-bold text-[#5d6d87] tracking-wide">
              Email <span className="text-[#c1a478]">*</span>
            </label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white border border-gray-200 focus:border-[#c1a478] outline-none transition-all duration-300 rounded-sm shadow-sm text-sm sm:text-base min-h-[48px]"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Website Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-bold text-[#5d6d87] tracking-wide">
              Website
            </label>
            <input 
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white border border-gray-200 focus:border-[#c1a478] outline-none transition-all duration-300 rounded-sm shadow-sm text-sm sm:text-base min-h-[48px]"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#c1a478] hover:bg-[#b09367] text-white px-8 py-4 sm:px-10 sm:py-5 font-bold text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-300 rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] w-full sm:w-auto"
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? 'Submitting...' : 'Post Comment'}
          </motion.button>
        </form>
      </div>
    </section>
  );
}
