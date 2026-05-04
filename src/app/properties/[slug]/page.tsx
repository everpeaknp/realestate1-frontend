'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SinglePropertyHero from '@/components/properties/single-property/SinglePropertyHero';
import PropertyDescription from '@/components/properties/single-property/PropertyDescription';
import PropertyGallery from '@/components/properties/single-property/PropertyGallery';
import PropertyFeatures from '@/components/properties/single-property/PropertyFeatures';
import PropertyFloorPlan from '@/components/properties/single-property/PropertyFloorPlan';
import PropertySidebar from '@/components/properties/single-property/PropertySidebar';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import { EagleProperty } from '@/lib/eagle-api';
import { extractEagleId } from '@/lib/eagle-slug';

export default function SinglePropertyPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const eagleId = extractEagleId(slug); // works for both new (address--id) and legacy (plain id) slugs
  const [property, setProperty] = useState<EagleProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from our secure API route
        const response = await fetch(`/api/eagle/properties/${eagleId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch property');
        }

        setProperty(data.property);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProperty();
    }
  }, [slug, eagleId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#c1a478] border-r-transparent mb-4"></div>
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center max-w-md px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
            <a
              href="/properties"
              className="inline-block bg-[#c1a478] text-white px-6 py-3 rounded hover:bg-[#b39468] transition-colors"
            >
              View All Properties
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
      <SinglePropertyHero property={property} />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <PropertyDescription property={property} />
            <PropertyGallery property={property} />
            <PropertyFeatures property={property} />
            <PropertyFloorPlan property={property} />
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
