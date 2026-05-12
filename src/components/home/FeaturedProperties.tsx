'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { EagleProperty } from '@/lib/eagle-api';
import { buildEagleSlug } from '@/lib/eagle-slug';
import LazyImage from '@/components/shared/LazyImage';
import { parsePropertyStats } from '@/lib/property-utils';

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

function removeEmojis(text: string): string {
  // Remove all emojis and emoji-like characters
  return text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{FE00}-\u{FE0F}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F18E}]|[\u{3030}]|[\u{2B50}]|[\u{2B55}]|[\u{231A}]|[\u{231B}]|[\u{23E9}-\u{23EC}]|[\u{23F0}]|[\u{23F3}]|[\u{25FD}]|[\u{25FE}]|[\u{2614}]|[\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}]|[\u{26AB}]|[\u{26BD}]|[\u{26BE}]|[\u{26C4}]|[\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}]|[\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}]|[\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}]|[\u{2B1C}]/gu, '').trim();
}

function getStatusLabel(status?: string): string {
  if (!status) return 'FOR SALE';
  return status.replace(/_/g, ' ').toUpperCase();
}

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

function getPropertyDetails(property: EagleProperty): string {
  const { beds, baths, cars } = parsePropertyStats(property);

  const parts = [];
  if (beds) parts.push(`${beds} Bed`);
  if (baths) parts.push(`${baths} Bath`);
  if (cars) parts.push(`${cars} Car`);

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
        // Fetch home properties for first card
        const homeRes = await fetch('/api/eagle/properties?limit=20&propertyType=HOUSE');
        const homeData = await homeRes.json();
        
        // Fetch other properties for remaining cards
        const otherRes = await fetch('/api/eagle/properties?limit=20');
        const otherData = await otherRes.json();

        let allProperties: any[] = [];
        
        if (homeData.success && Array.isArray(homeData.properties) && homeData.properties.length > 0) {
          // Sort by latest (createdAt or updatedAt)
          const sortedHomes = homeData.properties.sort((a: EagleProperty, b: EagleProperty) => {
            const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return dateB - dateA; // Most recent first
          });
          
          // Add latest home property as first card
          const homeProp = sortedHomes[0];
          const rawTitle = homeProp.headline || homeProp.formattedAddress.split(',')[0];
          const cleanTitle = removeEmojis(rawTitle);
          allProperties.push({
            id: homeProp.id,
            title: cleanTitle,
            location: homeProp.formattedAddress.split(',')[1]?.trim() || 'Sydney',
            details: getPropertyDetails(homeProp),
            img: homeProp.thumbnailSquare || homeProp.images?.[0]?.url || FALLBACK_PROPERTIES[0]?.img,
            span: "md:col-span-6 lg:col-span-8",
            badge: getStatusLabel(homeProp.status),
            badgeDark: homeProp.status === 'SOLD',
            slug: buildEagleSlug(homeProp.id, cleanTitle)
          });
        } else {
          // Use fallback for first card if no home property found
          allProperties.push(FALLBACK_PROPERTIES[0]);
        }

        if (otherData.success && Array.isArray(otherData.properties) && otherData.properties.length > 0) {
          // Sort by latest (createdAt or updatedAt)
          const sortedOthers = otherData.properties.sort((a: EagleProperty, b: EagleProperty) => {
            const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return dateB - dateA; // Most recent first
          });
          
          // Add other properties for remaining cards
          const otherProps = sortedOthers.slice(0, 4).map((prop: EagleProperty, idx: number) => {
            const rawTitle = prop.headline || prop.formattedAddress.split(',')[0];
            const cleanTitle = removeEmojis(rawTitle);
            return {
              id: prop.id,
              title: cleanTitle,
              location: prop.formattedAddress.split(',')[1]?.trim() || 'Sydney',
              details: getPropertyDetails(prop),
              img: prop.thumbnailSquare || prop.images?.[0]?.url || FALLBACK_PROPERTIES[idx + 1]?.img,
              span: "md:col-span-3 lg:col-span-4",
              badge: getStatusLabel(prop.status),
              badgeDark: prop.status === 'SOLD',
              slug: buildEagleSlug(prop.id, cleanTitle)
            };
          });
          allProperties = [...allProperties, ...otherProps];
        } else {
          // Use fallback for remaining cards
          allProperties = [...allProperties, ...FALLBACK_PROPERTIES.slice(1, 5)];
        }

        // Ensure we have exactly 5 properties
        if (allProperties.length < 5) {
          allProperties = [...allProperties, ...FALLBACK_PROPERTIES.slice(allProperties.length, 5)];
        }

        setProperties(allProperties);
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
        {/* See More Link */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => router.push('/properties')}
            className="flex items-center gap-2 text-sm font-medium text-black hover:text-black/70 transition-colors cursor-pointer group"
          >
            <span>See More</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

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
                <span 
                  className="label-caps mb-2 block tracking-widest"
                  style={{ color: idx === 0 ? 'rgba(255, 255, 255, 0.7)' : '#FFDEA0' }}
                >
                  {prop.location}
                </span>
                <h4 className={`${idx === 0 ? 'text-3xl' : 'text-2xl'} font-semibold mb-2 ${idx !== 0 ? 'line-clamp-1' : ''}`}>
                  {prop.title}
                </h4>
                {idx === 0 && prop.details && <p className="opacity-80 font-light text-sm">{prop.details}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
