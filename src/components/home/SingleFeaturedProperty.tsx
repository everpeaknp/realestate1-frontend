'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bed, Bath, Car } from 'lucide-react';
import { EagleProperty } from '@/lib/eagle-api';
import { buildEagleSlug } from '@/lib/eagle-slug';
import { parsePropertyStats } from '@/lib/property-utils';

function formatPrice(property: EagleProperty): string {
  if (property.advertisedPrice) {
    const cleaned = property.advertisedPrice.split(/\s*[|—–]\s*/)[0].trim();
    if (/[\d$]/.test(cleaned)) return cleaned;
  }
  if (property.price) {
    return '$' + property.price.toLocaleString('en-AU', { maximumFractionDigits: 0 });
  }
  return 'Contact for price';
}

function getStatusBadge(status?: string): string {
  if (!status) return 'FOR SALE';
  const map: Record<string, string> = {
    ACTIVE: 'FOR SALE',
    CURRENT: 'FOR SALE',
    SOLD: 'SOLD',
    LEASED: 'LEASED',
    UNDER_CONTRACT: 'UNDER CONTRACT',
  };
  return map[status.toUpperCase()] ?? status.replace(/_/g, ' ').toUpperCase();
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <section className="pb-[120px] max-w-[1440px] mx-auto px-4 md:px-[80px]">
      <div className="mb-12">
        <div className="h-12 w-80 bg-surface-container-high rounded animate-pulse" />
      </div>
      <div className="bg-surface-container-low rounded-xl p-6 md:p-10 flex flex-col lg:flex-row gap-10 soft-shadow">
        <div className="lg:w-[65%] rounded-xl bg-surface-container-high animate-pulse min-h-[400px]" />
        <div className="lg:w-[35%] flex flex-col justify-center space-y-6 py-4">
          <div className="space-y-3">
            <div className="h-6 w-24 bg-surface-container-high rounded-full animate-pulse" />
            <div className="h-8 w-full bg-surface-container-high rounded animate-pulse" />
            <div className="h-8 w-2/3 bg-surface-container-high rounded animate-pulse" />
            <div className="h-6 w-24 bg-surface-container-high rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-3 gap-4 border-y border-outline-variant py-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-5 w-5 bg-surface-container-high rounded animate-pulse" />
                <div className="h-3 w-12 bg-surface-container-high rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-surface-container-high rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-surface-container-high rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-surface-container-high rounded animate-pulse" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-14 w-full bg-surface-container-high rounded-full animate-pulse" />
            <div className="h-14 w-full bg-surface-container-high rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SingleFeaturedProperty() {
  const [property, setProperty] = useState<EagleProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetch HOUSE properties only (homes, not land) - fetch more to sort
        const res = await fetch('/api/eagle/properties?limit=20&propertyType=HOUSE');
        const data = await res.json();

        if (data.success && Array.isArray(data.properties) && data.properties.length > 0) {
          // Sort by latest (createdAt or updatedAt)
          const sortedProperties = data.properties.sort((a: EagleProperty, b: EagleProperty) => {
            const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return dateB - dateA; // Most recent first
          });
          
          // Prefer a property explicitly marked as featured, otherwise use the latest
          const featured =
            sortedProperties.find((p: EagleProperty) => p.featured) ?? sortedProperties[0];
          setProperty(featured);
        }
      } catch (err) {
        console.error('[SingleFeaturedProperty] Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) return <Skeleton />;

  // If no property came back, render nothing (FeaturedProperties grid below will show)
  if (!property) return null;

  const { beds, baths, cars } = parsePropertyStats(property);
  const price = formatPrice(property);
  const badge = getStatusBadge(property.status);
  const title = property.headline || property.formattedAddress.split(',')[0];
  const image =
    property.images?.[0]?.url ||
    property.thumbnailSquare ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCzpXqzg_1poibm6hGs_fY753srQatXUhnclxjIf_HVXtB0mQwc-UErPlw_S8Ucbexm9jI1cOSqBasruZVpUR2KjUuGNz7mtlnQkCenDLgV9C2uUDza6SG4gM4KUlCf4NV9ghM_Y7XIMXcOgkC5KLtBZjamAutcyHj5M5mGHCreR-ff5YvQW3CoOvm65hex1d-TKVFWFqZcPCbVsDWRrQ8GtET4a-EqN_iDpwFlFXVFar6Qk8tqzOXMFcgw0_b2cIdhrCIetx92s-c';
  const slug = buildEagleSlug(property.id, title);

  const features = [
    ...(beds !== null ? [{ icon: <Bed size={20} />, label: `${beds} BEDS` }] : []),
    ...(baths !== null ? [{ icon: <Bath size={20} />, label: `${baths} BATHS` }] : []),
    ...(cars !== null ? [{ icon: <Car size={20} />, label: `${cars} CARS` }] : []),
  ];

  return (
    <section className="pt-12 pb-[120px] max-w-[1440px] mx-auto px-4 md:px-[80px]" id="properties">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl lg:text-6xl">Featured Excellence</h2>
      </div>

      {/* Card */}
      <div className="bg-surface-container-low rounded-xl p-6 md:p-10 flex flex-col lg:flex-row gap-10 soft-shadow">
        {/* Image */}
        <div className="lg:w-[65%] overflow-hidden rounded-xl">
          <img
            src={image}
            alt={property.headline || property.formattedAddress}
            className="w-full h-full min-h-[400px] object-cover hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Details */}
        <div className="lg:w-[35%] flex flex-col justify-center space-y-8 py-4">
          {/* Badge + Title + Price */}
          <div className="space-y-4">
            <span className="inline-block bg-black text-white px-4 py-1 rounded-full label-caps">
              {badge}
            </span>
            <h3 className="text-3xl md:text-4xl font-semibold">
              {property.headline || property.formattedAddress}
            </h3>
            <p className="text-2xl text-secondary font-display">{price}</p>
          </div>

          {/* Stats — only shown if we extracted at least one feature */}
          {features.length > 0 && (
            <div className="grid grid-cols-3 gap-4 border-y border-outline-variant py-6">
              {features.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="text-on-surface-variant opacity-60">{item.icon}</div>
                  <span className="text-[10px] font-semibold tracking-tighter uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {property.description && (
            <p className="text-on-surface-variant leading-relaxed line-clamp-4">
              {property.description}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push(`/properties/${slug}`)}
              className="bg-black text-white py-4 rounded-full font-medium hover:bg-black/80 transition-all cursor-pointer"
            >
              View Property
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="border border-outline py-4 rounded-full font-medium hover:bg-surface-container transition-all cursor-pointer"
            >
              Schedule Inspection
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
