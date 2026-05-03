'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
import { apiRequest, API_ENDPOINTS } from '@/lib/api';

interface PropertyData {
  title: string;
  location: {
    display: string;
  };
  price: string;
  sqft: number;
  main_image: string | null;
}

export default function SinglePropertyPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await apiRequest<PropertyData>(API_ENDPOINTS.properties.detail(slug));
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProperty();
    }
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Property not found</div>
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
