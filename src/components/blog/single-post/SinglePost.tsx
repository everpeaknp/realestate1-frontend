'use client';

import { motion } from 'framer-motion';
import { FileText, Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SinglePostProps {
  slug: string;
}

export default function SinglePost({ slug }: SinglePostProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>

        {/* Article Header */}
        <article>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                Real Estate Tips
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog Post Title: {slug}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>John Doe</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>April 20, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">Featured Image</p>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              This is a placeholder introduction for the blog post. In a real application, 
              this would contain the actual blog post content with rich formatting, images, 
              and other media.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Section Heading</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Subsection</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
              eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <ul className="list-disc list-inside space-y-2 mb-6 text-gray-600">
              <li>Key point one about the topic</li>
              <li>Important consideration two</li>
              <li>Essential tip three</li>
              <li>Valuable insight four</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Another Section</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              More content would go here in a real blog post. This could include 
              detailed explanations, case studies, examples, and actionable advice 
              for readers interested in real estate.
            </p>
          </div>

          {/* Tags */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                Real Estate
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                Property Investment
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                Home Buying
              </span>
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">About the Author</h3>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div>
                <p className="font-semibold mb-1">John Doe</p>
                <p className="text-sm text-gray-600">
                  Real estate expert with over 10 years of experience helping clients 
                  find their dream homes and make smart property investments.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Related Posts</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 rounded-lg h-40 mb-4"></div>
              <h4 className="font-semibold mb-2">Related Post Title 1</h4>
              <p className="text-sm text-gray-600">Brief description of the related post...</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 rounded-lg h-40 mb-4"></div>
              <h4 className="font-semibold mb-2">Related Post Title 2</h4>
              <p className="text-sm text-gray-600">Brief description of the related post...</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
