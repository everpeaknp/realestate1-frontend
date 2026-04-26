'use client';

import { ChevronRight, Bed, Bath } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/api';

interface Property {
  id: number;
  slug: string;
  title: string;
  location: string;
  price: string;
  main_image: string | null;
  property_type: string;
  beds: number;
  baths: number;
  sqft: number;
}

function formatPrice(price: string): string {
  const numPrice = parseFloat(price);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numPrice);
}

function getImageUrl(imageUrl: string | null): string {
  if (!imageUrl)
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000';

  if (imageUrl.startsWith('http')) return imageUrl;

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  return `${API_URL}${imageUrl}`;
}

export default function InfiniteRightToLeftCarousel() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const startX = useRef(0);
  const lastTranslate = useRef(0);
  const cardWidthRef = useRef(0);

  const router = useRouter();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.properties.featured);
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Duplicate (IMPORTANT)
  const looped = [...properties, ...properties];

  // Smooth auto scroll (RIGHT → LEFT)
  useEffect(() => {
    if (!isAutoScrolling || isDragging) return;

    let frame: number;

    const animate = () => {
      setTranslateX((prev) => prev - 0.4); // speed

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [isAutoScrolling, isDragging]);

  // Seamless infinite loop (NO JUMP)
  useEffect(() => {
    if (!cardWidthRef.current || properties.length === 0) return;

    const totalWidth = properties.length * cardWidthRef.current;

    if (Math.abs(translateX) >= totalWidth) {
      setTranslateX(0);
    }
  }, [translateX, properties.length]);

  // Drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoScrolling(false);

    startX.current = e.clientX;
    lastTranslate.current = translateX;
  };

  // Drag move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const diff = e.clientX - startX.current;

    setTranslateX(lastTranslate.current + diff);
  };

  // Drag end
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsAutoScrolling(true);
  };

  const handleMouseLeave = () => {
    if (isDragging) handleMouseUp();
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    handleMouseDown(e.touches[0] as any);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMouseMove(e.touches[0] as any);
  };

  const handleCardClick = (slug: string) => {
    if (!isDragging) router.push(`/properties/${slug}`);
  };

  if (loading) {
    return <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />;
  }

  if (properties.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-[1400px] mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Homes</h2>
            <p className="text-gray-600">Explore premium listings</p>
          </div>

          <Link
            href="/properties"
            className="text-blue-600 flex items-center gap-1"
          >
            View all <ChevronRight size={16} />
          </Link>
        </div>

        {/* Carousel */}
        <div
          className={`overflow-hidden ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <div
            className="flex gap-6"
            style={{
              transform: `translateX(${translateX}px)`,
              transition: isDragging ? 'none' : 'transform 0.05s linear',
            }}
          >
            {looped.map((prop, idx) => (
              <div
                key={`${prop.id}-${idx}`}
                className="w-80 flex-shrink-0"
                ref={(el) => {
                  if (el && cardWidthRef.current === 0) {
                    cardWidthRef.current = el.offsetWidth + 24;
                  }
                }}
                onClick={() => handleCardClick(prop.slug)}
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md">

                  <div className="h-52 bg-gray-200 relative">
                    <img
                      src={getImageUrl(prop.main_image)}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute top-0 left-0 overflow-hidden w-24 h-24 z-10">
                      <div className={`absolute top-3 -left-8 w-36 py-1 text-center text-[10px] font-bold tracking-widest text-white shadow-lg transform -rotate-45 ${
                        prop.property_type === 'FOR_SALE' ? 'bg-[#5d6d87]' : 'bg-[#5d6d87]/90'
                      }`}>
                        {prop.property_type === 'FOR_SALE' ? 'FOR SALE' : 'FOR RENT'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold truncate">
                      {prop.title}
                    </h3>

                    <p className="text-sm text-gray-500 truncate">
                      {prop.location}
                    </p>

                    <p className="text-lg font-bold">
                      {formatPrice(prop.price)}
                    </p>

                    <div className="flex gap-3 text-sm text-gray-600 mt-2">
                      <span><Bed size={16} /> {prop.beds}</span>
                      <span><Bath size={16} /> {prop.baths}</span>
                      <span>{prop.sqft} sqft</span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}