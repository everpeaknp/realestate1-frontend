'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlogPost, formatDate } from '@/lib/blogApi';

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  // Safeguard: ensure posts is an array
  const safePosts = Array.isArray(posts) ? posts : [];

  if (safePosts.length === 0) {
    return (
      <section className="bg-white py-20 text-center">
        <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">No Blog Posts Available</h2>
        <p className="text-[#5d6d87] text-lg">
          Please check back later for new content.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
        {safePosts.map((post, index) => (
          <Link href={`/blog/${post.slug}`} key={post.id}>
            <motion.div 
              className="flex flex-col group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="aspect-[16/10] overflow-hidden rounded-sm mb-4 bg-gray-200">
                {post.featured_image ? (
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <svg 
                      className="w-20 h-20 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-center px-4">
                <h3 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-4 group-hover:text-[#c1a478] transition-colors leading-tight font-sans">
                  {post.title}
                </h3>
                <div className="text-[#5d6d87] text-[15px] font-medium font-sans">
                  <span>{post.author_name}</span>
                  <span className="mx-2 text-gray-300">/</span>
                  <span>{formatDate(post.published_at)}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Pagination - TODO: Implement pagination logic */}
      {safePosts.length > 8 && (
        <div className="mt-20 flex items-center justify-center gap-6 text-[13px] font-bold tracking-[0.2em] uppercase">
          <button className="flex items-center gap-2 text-gray-400 hover:text-[#1a1a1a] transition-colors">
            « PREVIOUS
          </button>
          <div className="flex items-center gap-4">
            <span className="text-[#c1a478]">1</span>
            <button className="text-[#1a1a1a] hover:text-[#c1a478] transition-colors">2</button>
          </div>
          <button className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#c1a478] transition-colors">
            NEXT »
          </button>
        </div>
      )}
    </section>
  );
}
