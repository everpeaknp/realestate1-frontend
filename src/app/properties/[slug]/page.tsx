import SinglePropertyHero from '@/components/properties/single-property/SinglePropertyHero';
import PropertyDescription from '@/components/properties/single-property/PropertyDescription';
import PropertyGallery from '@/components/properties/single-property/PropertyGallery';
import PropertyFeatures from '@/components/properties/single-property/PropertyFeatures';
import PropertyFloorPlan from '@/components/properties/single-property/PropertyFloorPlan';
import PropertySidebar from '@/components/properties/single-property/PropertySidebar';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';

export default function SinglePropertyPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Header />
      <SinglePropertyHero />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <PropertyDescription />
            <PropertyGallery />
            <PropertyFeatures />
            <PropertyFloorPlan />
          </div>
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <PropertySidebar />
            </div>
          </div>
        </div>
      
        <ContactSection />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
