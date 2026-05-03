'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';
import PropertySidebar from '@/components/shared/PropertySidebar';
import SinglePostHero from '@/components/blog/single-post/SinglePostHero';
import BlogPostContent from '@/components/blog/single-post/BlogPostContent';
import BlogGallery from '@/components/blog/single-post/BlogGallery';
import RelatedPosts from '@/components/blog/single-post/RelatedPosts';
import CommentForm from '@/components/blog/single-post/CommentForm';
import { getBlogPost, getRelatedPosts, formatDate, BlogPost } from '@/lib/blogApi';

export default function SingleBlogPostPageClient() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Client-side: Loading post with slug:', slug);
        const postData = await getBlogPost(slug);
        console.log('✅ Client-side: Post loaded:', postData.title);
        setPost(postData);
        
        // Load related posts
        const related = await getRelatedPosts(postData.slug, postData.category, 4);
        console.log('✅ Client-side: Related posts loaded:', related.length);
        setRelatedPosts(related);
      } catch (err) {
        console.error('❌ Client-side: Error loading post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c1a478] mx-auto mb-4"></div>
            <p className="text-[#5d6d87]">Loading blog post...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">Post Not Found</h1>
            <p className="text-[#5d6d87] mb-6">{error || 'The blog post you are looking for does not exist.'}</p>
            <a href="/blog" className="inline-block bg-[#c1a478] text-white px-6 py-3 rounded-sm hover:bg-[#b39568] transition-colors">
              Back to Blog
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <SinglePostHero
        title={post.title}
        author={post.author_name}
        date={formatDate(post.published_at)}
        comments={`${post.comments_count} Comment${post.comments_count !== 1 ? 's' : ''}`}
        backgroundImage={post.featured_image || '/images/blog-placeholder.jpg'}
      />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">
          <div className="lg:col-span-8 space-y-12">
            <BlogPostContent content={post.content || ''} />
            
            {/* Gallery Images */}
            {post.gallery_images && post.gallery_images.length > 0 && (
              <BlogGallery images={post.gallery_images} />
            )}
            
            {/* Comments Section */}
            <div className="border-t border-gray-100 pt-12">
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-8 font-sans">
                Comments ({post.comments_count})
              </h3>
              
              {/* Display existing comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="space-y-6 mb-12">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-6 rounded-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#c1a478] flex items-center justify-center text-white font-bold">
                          {comment.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#1a1a1a]">{comment.author_name}</p>
                          <p className="text-sm text-[#5d6d87]">{formatDate(comment.created_at)}</p>
                        </div>
                      </div>
                      <p className="text-[#5d6d87] leading-relaxed">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Comment Form */}
              <CommentForm postId={post.id} />
            </div>
          </div>
          <div className="lg:col-span-4 sticky top-24">
            <PropertySidebar />
          </div>
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
        
        <Newsletter />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}
