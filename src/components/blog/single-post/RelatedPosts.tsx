'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlogPost, formatDate } from '@/lib/blogApi';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#FFFAF3] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] text-center mb-12 font-sans">
          Related Posts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post, idx) => {
            // Use fallback image if featured_image is empty
            const postImage = post.featured_image && post.featured_image.trim() !== ''
              ? post.featured_image
              : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';

            return (
              <Link href={`/blog/${post.slug}`} key={post.id}>
                <motion.div 
                  className="flex flex-col group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] overflow-hidden rounded-sm mb-4 shadow-sm bg-gray-200">
                    <img 
                      src={postImage} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Content */}
                  <div className="text-center px-1">
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 group-hover:text-[#c1a478] transition-colors leading-tight font-sans">
                      {post.title}
                    </h3>
                    <div className="text-[#5d6d87] text-[13px] font-bold tracking-tight uppercase">
                      <span>{post.author_name}</span>
                      <span className="mx-2 text-gray-300">/</span>
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
