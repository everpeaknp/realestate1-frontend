import BlogHero from '@/components/blog/BlogHero';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';
import PropertySidebar from '@/components/shared/PropertySidebar';
import BlogSection from '@/components/blog/BlogSection';
import { getBlogPosts, BlogPost } from '@/lib/blogApi';

export const metadata = {
  title: 'Blog | Real Estate Tips & Insights | Lily White Realestate',
  description: 'Discover expert real estate advice, market insights, and home buying tips from Boston\'s trusted realtor.',
};

export default async function BlogPage() {
  // Fetch blog posts from API with error handling
  let posts: BlogPost[] = [];
  
  try {
    posts = await getBlogPosts();
    // Ensure posts is an array
    if (!Array.isArray(posts)) {
      console.error('getBlogPosts did not return an array:', posts);
      posts = [];
    }
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    // Return empty array on error - error boundary will catch if needed
    posts = [];
  }

  return (
    <>
      <Header />
      <BlogHero />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">
          <div className="lg:col-span-8 space-y-12">
            {posts.length > 0 ? (
              <BlogSection posts={posts} />
            ) : (
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">No Blog Posts Yet</h2>
                <p className="text-[#5d6d87] text-lg">
                  Check back soon for expert real estate insights and tips!
                </p>
              </div>
            )}
          </div>
          <div className="lg:col-span-4 sticky top-24">
            <PropertySidebar />
          </div>
        </div>
        <Newsletter />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}
