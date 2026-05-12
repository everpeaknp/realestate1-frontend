'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SinglePropertyHero from '@/components/properties/single-property/SinglePropertyHero';
import PropertyHeader from '@/components/properties/single-property/PropertyHeader';
import PropertyDescription from '@/components/properties/single-property/PropertyDescription';
import PropertyGallery from '@/components/properties/single-property/PropertyGallery';
import LocationSection from '@/components/properties/single-property/LocationSection';
import PropertySidebar from '@/components/properties/single-property/PropertySidebar';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';

import { EagleProperty } from '@/lib/eagle-api';
import { extractEagleId } from '@/lib/eagle-slug';

export default function SinglePropertyPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const eagleId = extractEagleId(slug);
  const [property, setProperty] = useState<EagleProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
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
    if (slug) fetchProperty();
  }, [slug, eagleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F9]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-secondary border-r-transparent mb-4" />
          <p className="text-on-surface-variant">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F9]">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-serif text-on-surface mb-4">Property Not Found</h2>
          <p className="text-on-surface-variant mb-6">
            {error || 'The property you are looking for does not exist.'}
          </p>
          <a
            href="/properties"
            className="inline-block bg-primary text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
          >
            View All Properties
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F9] selection:bg-neutral-200">
      <main>
        {/* Hero — full-width, no padding */}
        <section className="pt-0">
          <SinglePropertyHero property={property} />
        </section>

        {/* Property Header */}
        <PropertyHeader property={property} />

        {/* Description + Sidebar — two-column grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: description (7 cols) */}
            <div className="lg:col-span-7">
              <PropertyDescription property={property} />
            </div>

            {/* Right: sidebar (5 cols) */}
            <div className="lg:col-span-5">
              <PropertySidebar />
            </div>
          </div>
        </section>

        {/* Gallery — full-width */}
        <PropertyGallery property={property} />

        {/* Location — full-width */}
        <LocationSection property={property} />

        {/* Footer sections */}
        <ContactSection />
        <Newsletter />
      </main>
    </div>
  );
}
