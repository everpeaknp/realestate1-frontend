import { Suspense } from 'react';
import PropertiesHero from '@/components/properties/PropertiesHero';
import AboutProperty from '@/components/properties/AboutProperty';
import PropertyList from '@/components/properties/PropertyList';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import PropertyCardSkeleton from '@/components/shared/PropertyCardSkeleton';

// Enable static generation with revalidation every 5 minutes
export const revalidate = 300;

export default function PropertiesPage() {
  return (
    <>
      <Header />
      <PropertiesHero />
      <AboutProperty />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        <PropertyList />
      </Suspense>
      <ContactSection />
      <Newsletter />
      <Footer />
    </>
  );
}
