'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { API_ENDPOINTS, API_URL } from '@/lib/api';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  featured_image: string | null;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600';

function getBlogImage(image: string | null): string {
  if (!image) return FALLBACK_IMAGE;
  if (image.startsWith('http')) return image;
  return `${API_URL}${image}`;
}

export default function InstagramGallery() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.blog.list}?page_size=8&ordering=-published_at`);
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        const results: BlogPost[] = Array.isArray(data) ? data : (data.results || []);
        setPosts(results.slice(0, 8));
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section className="bg-white py-8 sm:py-12 pb-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5d6d87]">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <h2 className="text-xs sm:text-[13px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#5d6d87] uppercase">
          Latest Blog Posts
        </h2>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              className="w-full aspect-square overflow-hidden relative group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link href={`/blog/${post.slug}`} className="block w-full h-full">
                <img
                  src={getBlogImage(post.featured_image)}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#c1a478]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
