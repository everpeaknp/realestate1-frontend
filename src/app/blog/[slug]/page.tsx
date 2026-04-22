import SinglePostHero from '@/components/blog/single-post/SinglePostHero';
import BlogPostContent from '@/components/blog/single-post/BlogPostContent';
import CommentForm from '@/components/blog/single-post/CommentForm';
import RelatedPosts from '@/components/blog/single-post/RelatedPosts';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';
import PropertySidebar from '@/components/shared/PropertySidebar';

export default function SinglePostPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Header />
      <SinglePostHero />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">
          <div className="lg:col-span-8">
            <BlogPostContent />
          </div>
          <div className="lg:col-span-4 sticky top-24">
            <PropertySidebar />
          </div>
        </div>
        <RelatedPosts />
        <CommentForm/>
        <Newsletter />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}
