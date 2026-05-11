'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { EagleProperty } from '@/lib/eagle-api';
import LazyImage from '@/components/shared/LazyImage';

// ─── Hardcoded Fallback Data ──────────────────────────────────────────────────
const FALLBACK_SOLD = [
  { 
    id: 'sold-1',
    location: 'AUSTRAL NSW', 
    price: '$1.355M', 
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA73Pl8LwLlCYvYbH4pNwhjJWd2GUsEaC5xKl2c13olnQNyXvvDm04gRsuXR9R45AnBS_USG19gx7TaL4PSQxcW7cFsJTGZa_sRtil_4ALwVua3oujdUWWbcl1lXpsaqmBZNYbqHhOo4hZH77wnQrSogUfPqznSvGbhS2wB0sztHYoCMto5vXlazMzm6kJYcvgnIN7FMpM5J23Kxhdm3hExaHfe9Flqdf1GRvQfiuGVtb-Lo8EL4ZP4_jiXUjjLM-DwnAIjECqtUqQ',
    rotation: 'rotate-12'
  },
  { 
    id: 'sold-2',
    location: 'ORAN PARK NSW', 
    price: '$1.420M', 
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-DCkJw3x9t5qO6OUaV9pRI0B4Xk06i8ThAfArRP3BUXTOZRbQ4Khkm-I0xRSh9wkjzxFQpYFCUWO6kSMnTHSnKnueq9Q-8sjciHsNJ3qbi9z8cq7_g5T2Fj-R2RgV3_lpT1YFA5gtIzmSUR1wBn4MVfmQjsNNMTSgs7wmJg2s1j6DTLk1C8y5_2qLG_Lr-dHo2EQFjZd7ckOwVmdBrUt4BlJWqvZiC9DKhOU7xa2oy4kFLHNq1-9mngmipapnHfSfXc8tVZ2qw0Y',
    rotation: '-rotate-12'
  },
  { 
    id: 'sold-3',
    location: 'LEPPINGTON NSW', 
    price: '$985,000', 
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAEGZrCUUQ4oYL9lSsSv8dmSYyw5QNAnJyJvX3rZnIOsa5pA8X_R4attGu0r_QWcS3vQ44xTrgZGKM0smUkSHtZYJczYy8TLGz2F3HkTGfwDZuxB4VL_Xc6OVa0Aj4Q3bMzifHr8Aw3iILja47c3JagH3Q_ChT4-WOPtHgAnCrIgzhpnfog6J9DSNG1H0NX_XCbiEjqD4qzVEN_-6Wy-CzILYM7EWyR96MgNTAjjRqWnp4c9mtLC_cUZDsChXVorxdazCXaBc02mc',
    rotation: 'rotate-6'
  }
];

export default function SoldGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSold = async () => {
      try {
        const res = await fetch('/api/eagle/properties?status=SOLD&limit=3');
        const data = await res.json();

        let apiItems: any[] = [];
        if (data.success && Array.isArray(data.properties)) {
          apiItems = data.properties.map((prop: EagleProperty, idx: number) => ({
            id: prop.id,
            location: prop.formattedAddress.toUpperCase(),
            price: prop.advertisedPrice || (prop.price ? `$${(prop.price / 1000).toLocaleString()}` : 'SOLD'),
            img: prop.thumbnailSquare || prop.images?.[0]?.url || FALLBACK_SOLD[idx]?.img,
            rotation: FALLBACK_SOLD[idx]?.rotation || 'rotate-12'
          }));
        }

        // Fill remaining slots with fallback data if less than 3
        const finalItems = [...apiItems];
        for (let i = apiItems.length; i < 3; i++) {
          finalItems.push(FALLBACK_SOLD[i]);
        }
        
        setItems(finalItems);
      } catch (err) {
        console.error('Failed to fetch Sold properties:', err);
        setItems(FALLBACK_SOLD);
      } finally {
        setLoading(false);
      }
    };

    fetchSold();
  }, []);

  if (loading) {
    return (
      <section className="py-section-gap bg-black text-white overflow-hidden">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div className="h-[600px] w-full bg-white/5 animate-pulse rounded-2xl" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-section-gap bg-black text-white overflow-hidden" id="sold">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="label-caps text-outline-variant tracking-widest uppercase">Proven Results</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl mt-4 line-clamp-1">Recently Sold</h2>
          </div>
          <button className="flex items-center gap-2 group transition-all text-sm font-semibold tracking-widest uppercase mb-2">
            VIEW ALL RESULTS <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((sold, i) => (
            <div key={sold.id || i} className="relative group">
              <div className="grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden rounded-xl aspect-[4/3] relative">
                <LazyImage 
                  src={sold.img} 
                  alt="Sold Property" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className={`text-4xl md:text-5xl font-display font-bold ${sold.rotation} opacity-90 border-4 border-red-600 px-8 py-2 text-red-600 uppercase tracking-tighter`}>
                    SOLD
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <p className="label-caps text-outline-variant mb-2">{sold.location}</p>
                <p className="text-3xl font-semibold">{sold.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
