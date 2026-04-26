'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { API_ENDPOINTS, API_URL } from '@/lib/api';

const PAGE_SIZE = 8;

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string | null;
  author_name: string;
  category: string | { name: string } | null;
  published_at: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getImage(img: string | null): string {
  if (!img) return 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800';
  return img.startsWith('http') ? img : `${API_URL}${img}`;
}

function getCategoryName(cat: string | { name: string } | null): string {
  if (!cat) return '';
  return typeof cat === 'string' ? cat : (cat.name || '');
}

function BlogListInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all posts once (or when search changes)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = activeSearch
          ? `${API_ENDPOINTS.blog.list}?search=${encodeURIComponent(activeSearch)}&ordering=-published_at&page_size=100`
          : `${API_ENDPOINTS.blog.list}?ordering=-published_at&page_size=100`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setAllPosts(Array.isArray(data) ? data : (data.results || []));
      } catch {
        setError('Failed to load blog posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeSearch]);

  // Client-side pagination
  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const posts = allPosts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/blog?${params.toString()}`, { scroll: false });
    setTimeout(() => {
      document.getElementById('blog-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (loading) {
    return (
      <div id="blog-list" className="space-y-12 py-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[16/10] bg-gray-100 rounded mb-4" />
            <div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div id="blog-list" className="py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div id="blog-list" className="py-4">
      {/* Search indicator */}
      {activeSearch && (
        <div className="flex items-center gap-2 text-sm text-[#5d6d87] mb-8">
          <span>Showing results for <strong>&quot;{activeSearch}&quot;</strong> ({allPosts.length} found)</span>
          <Link href="/blog" className="text-[#c1a478] hover:underline ml-1">Clear</Link>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">
            {activeSearch ? `No results for "${activeSearch}"` : 'No Blog Posts Yet'}
          </h2>
          <p className="text-[#5d6d87] text-lg">
            {activeSearch ? 'Try a different search term.' : 'Check back soon!'}
          </p>
          {activeSearch && (
            <Link href="/blog" className="mt-4 inline-block text-[#c1a478] font-semibold hover:underline">
              View all posts
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Posts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12 mb-12">
            {posts.map((post, index) => (
              <Link href={`/blog/${post.slug}`} key={post.id}>
                <motion.div
                  className="flex flex-col group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.06 }}
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-sm mb-4 sm:mb-6 bg-gray-200">
                    <img
                      src={getImage(post.featured_image)}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-center px-2 sm:px-4">
                    {getCategoryName(post.category) && (
                      <span className="text-[11px] font-bold text-[#c1a478] uppercase tracking-widest mb-2 block">
                        {getCategoryName(post.category)}
                      </span>
                    )}
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#c1a478] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <div className="text-[#5d6d87] text-sm font-medium flex flex-wrap items-center justify-center gap-x-2">
                      <span>{post.author_name}</span>
                      <span className="text-gray-300">/</span>
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold tracking-[0.15em] uppercase mt-8">
              <button
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
                className="flex items-center gap-1 text-gray-400 hover:text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px] px-2"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-sm font-bold text-xs transition-colors ${
                      page === safePage
                        ? 'bg-[#c1a478] text-white'
                        : 'text-[#1a1a1a] hover:text-[#c1a478]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
                className="flex items-center gap-1 text-[#1a1a1a] hover:text-[#c1a478] disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px] px-2"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BlogList() {
  return (
    <Suspense fallback={
      <div className="space-y-12 py-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[16/10] bg-gray-100 rounded mb-4" />
            <div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    }>
      <BlogListInner />
    </Suspense>
  );
}
