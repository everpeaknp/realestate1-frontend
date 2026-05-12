'use client';

import { useEffect, useState } from 'react';

interface Neighborhood {
  id: number;
  name: string;
  image: string;
  description: string;
  price_range: string;
  order: number;
  is_active: boolean;
}

export default function PopularNeighborhoods() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home/neighborhoods/`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch neighborhoods');
        }
        
        const data = await response.json();
        
        // Handle paginated response from DRF
        const results = data.results || data;
        
        if (Array.isArray(results) && results.length > 0) {
          setNeighborhoods(results);
        } else {
          setError('No neighborhoods available');
        }
      } catch (err) {
        console.error('Failed to fetch neighborhoods:', err);
        setError(err instanceof Error ? err.message : 'Failed to load neighborhoods');
      } finally {
        setLoading(false);
      }
    };

    fetchNeighborhoods();
  }, []);

  if (loading) {
    return (
      <section className="py-[120px] bg-surface-container-low" id="expertise">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[80px]">
          <div className="text-center mb-20">
            <span className="label-caps tracking-widest text-black">Growth Corridors</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl mt-6">Areas of Expertise</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden soft-shadow">
                <div className="h-64 bg-brand-surface-container animate-pulse" />
                <div className="p-10 space-y-4">
                  <div className="h-7 bg-brand-surface-container animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-brand-surface-container animate-pulse rounded w-1/2" />
                  <div className="h-16 bg-brand-surface-container animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || neighborhoods.length === 0) {
    return (
      <section className="py-[120px] bg-surface-container-low" id="expertise">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[80px]">
          <div className="text-center mb-20">
            <span className="label-caps tracking-widest text-black">Growth Corridors</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl mt-6">Areas of Expertise</h2>
          </div>
          <div className="text-center py-20">
            <p className="text-brand-outline font-sans text-lg">
              {error || 'No neighborhoods available at the moment.'}
            </p>
            <p className="text-brand-outline font-sans text-sm mt-4">
              Please add neighborhoods through the admin panel.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[120px] bg-surface-container-low" id="expertise">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[80px]">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="label-caps tracking-widest text-black">Growth Corridors</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl mt-6">Areas of Expertise</h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {neighborhoods.map((area) => (
            <div
              key={area.id}
              className="bg-white rounded-xl overflow-hidden soft-shadow group cursor-pointer"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={area.image}
                  alt={area.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-10 space-y-4">
                <h4 className="text-2xl font-semibold">{area.name}</h4>
                {area.price_range && (
                  <p className="label-caps text-secondary tracking-widest">{area.price_range}</p>
                )}
                {area.description && (
                  <p className="text-on-surface-variant leading-relaxed">{area.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
