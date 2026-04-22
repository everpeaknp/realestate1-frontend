'use client';

import { motion } from 'framer-motion';
export default function CommentForm() {
  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4 font-sans">
            Leave a Reply
          </h2>
          <p className="text-[#5d6d87] text-[15px] font-medium">
            Your email address will not be published. Required fields are marked <span className="text-[#c1a478]">*</span>
          </p>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Comment Textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#5d6d87] tracking-wide">
              Comment <span className="text-[#c1a478]">*</span>
            </label>
            <textarea 
              rows={10}
              className="w-full px-5 py-4 bg-white border border-gray-200 focus:border-[#c1a478] outline-none transition-all duration-300 rounded-sm resize-none shadow-sm"
              required
            />
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#5d6d87] tracking-wide">
              Name <span className="text-[#c1a478]">*</span>
            </label>
            <input 
              type="text" 
              className="w-full px-5 py-4 bg-white border border-gray-200 focus:border-[#c1a478] outline-none transition-all duration-300 rounded-sm shadow-sm"
              required
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#5d6d87] tracking-wide">
              Email <span className="text-[#c1a478]">*</span>
            </label>
            <input 
              type="email" 
              className="w-full px-5 py-4 bg-white border border-gray-100 focus:border-[#c1a478] outline-none transition-all duration-300 rounded-sm shadow-sm"
              required
            />
          </div>

          {/* Website Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#5d6d87] tracking-wide">
              Website
            </label>
            <input 
              type="url" 
              className="w-full px-5 py-4 bg-white border border-gray-200 focus:border-[#c1a478] outline-none transition-all duration-300 rounded-sm shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="bg-[#c1a478] hover:bg-[#b09367] text-white px-10 py-5 font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block"
            whileTap={{ scale: 0.98 }}
          >
            Post Comment
          </motion.button>
        </form>
      </div>
    </section>
  );
}
