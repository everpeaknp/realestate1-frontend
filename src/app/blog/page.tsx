import BlogHero from '@/components/blog/BlogHero';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';
import PropertySidebar from '@/components/shared/PropertySidebar';
import BlogSection from '@/components/blog/BlogSection';

export default function BlogPage() {
  return (
    <>
      <Header />
      <BlogHero />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">
          <div className="lg:col-span-8 space-y-12">
            <BlogSection />
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
