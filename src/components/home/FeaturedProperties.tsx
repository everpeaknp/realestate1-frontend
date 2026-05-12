'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EagleProperty } from '@/lib/eagle-api';
import { buildEagleSlug } from '@/lib/eagle-slug';
import LazyImage from '@/components/shared/LazyImage';

// ─── Hardcoded Fallback Data (as requested by user) ──────────────────────────
const FALLBACK_PROPERTIES = [
  {
    id: 'fallback-1',
    title: "The Modernist Sanctuary",
    location: "AUSTRAL",
    details: "4 Bed · 3 Bath · 2 Car · $1.2M",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIgDZxFda4Ww8dzdflUHPol148s2EJx2a0cxlpClhv3OB24bshY5QBZ8DY9b7ZtwYhci1C480081EMIBbUCdlN7X5GgEMG-VxinOciJrwzx6TvdA_ubjMJtt-Uc2WXJuKUVb6LcVau3e7zVsZtkfv96sjp7e3ArqUM7bDUFhU-BrpH-kA9kRCiKgWAGFdc8F1Pwou_pUIjuRCtAdgonYTXwfVfYJGqO6UCtHTS3y24jsJMPBbyklG6raUTkt163NKVtHwXwJRSNo4",
    span: "md:col-span-6 lg:col-span-8",
    type: "Luxury Exterior"
  },
  {
    id: 'fallback-2',
    title: "Civic Green Estate",
    location: "ORAN PARK",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHCCrieYOIZEG12FwkT0rqTc_wo4dCJNNFNWUCQm4vmn_cYcXtQbh3XFn9fAv325HMiNk5U3ph6JQ8ZPDrFZyXiA210ePbbAi_-gwYIPKqqgKN4v5aemlkHBiwftNbRlpSN3RqEycgmPTA_YWK9buuJIWnhKNIhZCp7FmD8ODL6QI_vbHHeijgDYShbyRjO2WzqQj-mSzuGcIneqaN9igQ-0MiieYaQRwI7JieKZgfMCt_wed0534GoIevcJjOmFORnloQ8N3SYDA",
    span: "md:col-span-3 lg:col-span-4",
    badge: "OPEN HOME"
  },
  {
    id: 'fallback-3',
    title: "Urban Edge Townhome",
    location: "EDMONDSON PARK",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1slNwuci_XXjDF1dxjGzSFkhSLG1NiXsl_a0RKJbt-aIKQwUsbGMzDFRWVgmJDLsuljVuVoYXTogoRhMG_UEPnY034OxryW6Jpz7r4EzaXSskR5ZiT4tpdtow0ut1EdewqiW7ghsletDGFTpS1cgPgldpVLJPPZ_o-MVWQRiI-5V7WBWMLRqRBNLLyenghObws-tHv_jiYTm-lRFXa47QundEQBBsjmANQIFUXsGDP1fiHi3mHN-yypuMmS9PsxaXLSyS9De5hsU",
    span: "md:col-span-3 lg:col-span-4"
  },
  {
    id: 'fallback-4',
    title: "Panorama Rise",
    location: "LEPPINGTON",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBSjSk0z_y_HOaG6dI3D8s6tLh_SRQdBUJWINpx7s4Sr-JnGOloySk4g6oQY1Th2YRV9wq5gLTt9pfzRHCoZZ_UhFqTZ_CeuFGT1OHMKRH71iXzX-GvSk56wO-gGqVCu5Wx16dqD5rud_Od627VO8ode-80sI66Smh5CU-zS0CDd9igZ_b44WSA3NTnsAoajvNznj585Y5ZT9JkApC18Um1AchZ4Fi3O5Sq09GvRiLtHrLfycSU1TXldi6DumcO020knevlrYlZXU",
    span: "md:col-span-3 lg:col-span-4"
  },
  {
    id: 'fallback-5',
    title: "Lifestyle Executive",
    location: "GREGORY HILLS",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-NnUKjAoxZTls-iujRrf6rB7Orop0V9D6c5FhrLzZfvwTnK8BhWSmpMh-V30Bszcm8duxjKpsL-BhvPNp4b0dvxn4TBbMobvXMQmCq_xEgPuH954rdpidFGBEn3be8P9lHsF-63fi_Ot6fpIxBTt4PEJp0TQvfDr6aEDKvMjZYauEuAUej4lKBjC5-ezeiLi-PpS5sNcoA0CYjOZMU83L0QrgE5-4yUxqeEuM-IOxSD4G0oCo0y_4N09hEgEZBXsSsCyeMmmk1kE",
    span: "md:col-span-3 lg:col-span-4",
    badge: "SOLD",
    badgeDark: true
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusLabel(status?: string): string {
  if (!status) return 'FOR SALE';
  return status.replace(/_/g, ' ').toUpperCase();
}

function formatPrice(property: EagleProperty): string {
  if (property.advertisedPrice) return property.advertisedPrice;
  if (property.price) {
    return '$' + property.price.toLocaleString('en-AU', { maximumFractionDigits: 0 });
  }
  return 'Contact for price';
}

function getPropertyDetails(property: EagleProperty): string {
  const text = `${property.headline || ''} ${property.description || ''}`.toLowerCase();
  
  const bedroomMatch = text.match(/(\d+)\s*(?:bed|bedroom)/i);
  const bathroomMatch = text.match(/(\d+)\s*(?:bath|bathroom)/i);
  const carMatch = text.match(/(\d+)\s*(?:car|garage|parking)/i);

  const parts = [];
  if (bedroomMatch) parts.push(`${bedroomMatch[1]} Bed`);
  if (bathroomMatch) parts.push(`${bathroomMatch[1]} Bath`);
  if (carMatch) parts.push(`${carMatch[1]} Car`);
  
  const price = formatPrice(property);
  if (price !== 'Contact for price') parts.push(price);
  
  return parts.join(' · ');
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/eagle/properties?limit=5');
        const data = await res.json();

        if (data.success && Array.isArray(data.properties) && data.properties.length > 0) {
          // Map dynamic data to the requested design format
          const mapped = data.properties.map((prop: EagleProperty, idx: number) => ({
            id: prop.id,
            title: prop.headline || prop.formattedAddress.split(',')[0],
            location: prop.formattedAddress.split(',')[1]?.trim() || 'Sydney',
            details: getPropertyDetails(prop),
            img: prop.thumbnailSquare || prop.images?.[0]?.url || FALLBACK_PROPERTIES[idx]?.img,
            span: idx === 0 ? "md:col-span-6 lg:col-span-8" : "md:col-span-3 lg:col-span-4",
            badge: getStatusLabel(prop.status),
            badgeDark: prop.status === 'SOLD',
            slug: buildEagleSlug(prop.id, prop.formattedAddress)
          }));
          setProperties(mapped);
        } else {
          // Use fallback data if API returns nothing
          setProperties(FALLBACK_PROPERTIES);
        }
      } catch (err) {
        console.error('Failed to fetch Featured properties:', err);
        setProperties(FALLBACK_PROPERTIES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
    <section className="pb-section-gap bg-white py-section-gap">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-gutter auto-rows-[450px]">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`${i === 0 ? 'md:col-span-6 lg:col-span-8' : 'md:col-span-3 lg:col-span-4'} bg-brand-surface-container rounded-xl animate-pulse`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-section-gap bg-white py-section-gap">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-gutter auto-rows-[450px]">
          {properties.map((prop, idx) => (
            <div 
              key={prop.id} 
              onClick={() => prop.slug && router.push(`/properties/${prop.slug}`)}
              className={`${prop.span} group relative overflow-hidden rounded-xl soft-shadow min-h-[450px] cursor-pointer`}
            >
              <LazyImage 
                src={prop.img} 
                alt={prop.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                referrerPolicy="no-referrer"
              />
              
              {prop.badge && (
                <div className={`absolute top-6 right-6 px-4 py-1 rounded-full label-caps shadow-sm z-10 ${prop.badgeDark ? 'bg-black text-white' : 'bg-white/90 backdrop-blur text-black'}`}>
                  {prop.badge}
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute bottom-0 left-0 p-8 md:p-10 text-white w-full">
                <span className="label-caps text-white/70 mb-2 block tracking-widest">{prop.location}</span>
                <h4 className={`${idx === 0 ? 'text-3xl' : 'text-2xl'} font-semibold mb-2`}>{prop.title}</h4>
                {prop.details && <p className="opacity-80 font-light text-sm">{prop.details}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
