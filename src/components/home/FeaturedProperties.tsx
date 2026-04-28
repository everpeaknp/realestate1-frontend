'use client';

import { ChevronRight, Bed, Bath } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';
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

// Configuration
const SCROLL_SPEED = 0.5; // pixels per frame
const CARD_WIDTH = 320; // w-80 = 320px
const CARD_GAP = 24; // gap-6 = 24px
const MOMENTUM_FRICTION = 0.95;
const MOMENTUM_MIN_VELOCITY = 0.1;

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${API_URL}${imageUrl}`;
}

export default function InfiniteCarousel() {
  // State
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  const [translateX, setTranslateX] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Refs for performance (no state updates per frame)
  const isDraggingRef = useRef<boolean>(false);
  const isAutoScrollingRef = useRef<boolean>(true);
  const currentTranslateRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const startXRef = useRef<number>(0);
  const dragStartTranslateRef = useRef<number>(0);
  const dragDistanceRef = useRef<number>(0);
  const cardWidthWithGapRef = useRef<number>(CARD_WIDTH + CARD_GAP);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(Date.now());

  const router = useRouter();

  // Fetch properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.properties.featured);
        const data = await res.json();
        const fetchedProps = Array.isArray(data) ? data : data.results || [];

        if (fetchedProps.length > 0) {
          setProperties(fetchedProps);
          // Duplicate 3x for seamless infinite loop
          setDisplayedProperties([
            ...fetchedProps,
            ...fetchedProps,
            ...fetchedProps,
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Main animation loop
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      lastTimeRef.current = now;

      // Auto-scroll when not dragging and not hovering
      if (isAutoScrollingRef.current && !isDraggingRef.current && !isHovering) {
        currentTranslateRef.current -= SCROLL_SPEED;
      }

      // Apply momentum after drag
      if (velocityRef.current !== 0 && !isDraggingRef.current) {
        currentTranslateRef.current += velocityRef.current;
        velocityRef.current *= MOMENTUM_FRICTION;

        if (Math.abs(velocityRef.current) < MOMENTUM_MIN_VELOCITY) {
          velocityRef.current = 0;
        }
      }

      // Seamless infinite loop - wrap position mathematically
      if (properties.length > 0) {
        const singleSetWidth = properties.length * cardWidthWithGapRef.current;
        const totalWidth = singleSetWidth * 3; // 3x duplication

        // Normalize position to stay within bounds
        if (currentTranslateRef.current <= -totalWidth) {
          currentTranslateRef.current += singleSetWidth;
        } else if (currentTranslateRef.current > 0) {
          currentTranslateRef.current -= singleSetWidth;
        }
      }

      setTranslateX(currentTranslateRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovering, properties.length]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    isAutoScrollingRef.current = false;
    startXRef.current = e.clientX;
    dragStartTranslateRef.current = currentTranslateRef.current;
    dragDistanceRef.current = 0;
    velocityRef.current = 0;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;

    const diff = e.clientX - startXRef.current;
    dragDistanceRef.current = Math.abs(diff);
    currentTranslateRef.current = dragStartTranslateRef.current + diff;
    setTranslateX(currentTranslateRef.current);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;

    // Calculate momentum velocity
    const dragDelta = currentTranslateRef.current - dragStartTranslateRef.current;
    velocityRef.current = dragDelta * 0.1; // Momentum factor

    // Resume auto-scroll after a delay
    setTimeout(() => {
      isAutoScrollingRef.current = true;
    }, 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      handleMouseUp();
    }
  }, [handleMouseUp]);

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleMouseDown(e.touches[0] as any);
    },
    [handleMouseDown]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMouseMove(e.touches[0] as any);
    },
    [handleMouseMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

  // Hover handlers
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseEnterLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Card click handler
  const handleCardClick = useCallback(
    (slug: string) => {
      // Only navigate if drag distance is minimal (less than 5px)
      if (dragDistanceRef.current < 5) {
        router.push(`/properties/${slug}`);
      }
    },
    [router]
  );

  if (loading) {
    return <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />;
  }

  if (displayedProperties.length === 0) return null;

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
            className="flex items-center gap-1 transition-colors"
            style={{ color: '#C1A478' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            View all <ChevronRight size={16} />
          </Link>
        </div>

        {/* Carousel Container */}
        <div
          className={`overflow-hidden rounded-lg ${
            isDraggingRef.current ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel Track */}
          <div
            className="flex gap-6 will-change-transform"
            style={{
              transform: `translateX(${translateX}px)`,
              transition: 'none',
            }}
          >
            {displayedProperties.map((prop, idx) => (
              <PropertyCard
                key={`${prop.id}-${idx}`}
                property={prop}
                onClick={() => handleCardClick(prop.slug)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Property Card Component
interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <div
      className="w-80 flex-shrink-0 cursor-grab group"
      onClick={onClick}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        {/* Image Container */}
        <div className="h-52 bg-gray-200 relative overflow-hidden">
          <img
            src={getImageUrl(property.main_image)}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            draggable={false}
          />

          {/* Property Type Badge */}
          <div className="absolute top-0 left-0 overflow-hidden w-24 h-24 z-10">
            <div
              className={`absolute top-3 -left-8 w-36 py-1 text-center text-[10px] font-bold tracking-widest text-white shadow-lg transform -rotate-45 ${
                property.property_type === 'FOR_SALE'
                  ? 'bg-green-600'
                  : 'bg-green-600'
              }`}
              style={{
                backgroundColor: property.property_type === 'FOR_SALE' ? '#C1A478' : '#16a34a'
              }}
            >
              {property.property_type === 'FOR_SALE' ? 'FOR SALE' : 'FOR RENT'}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Title */}
          <h3 
            className="font-semibold text-gray-900 truncate transition-colors"
            style={{ '--hover-color': '#C1A478' } as any}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C1A478')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#111827')}
          >
            {property.title}
          </h3>

          {/* Location */}
          <p className="text-sm text-gray-500 truncate mb-2">
            {property.location}
          </p>

          {/* Price */}
          <p className="text-lg font-bold text-gray-900 mb-3">
            {formatPrice(property.price)}
          </p>

          {/* Property Details */}
          <div className="flex gap-4 text-sm text-gray-600">
            {/* Beds */}
            <div className="flex items-center gap-1">
              <Bed size={16} className="text-gray-400" />
              <span className="font-medium">{property.beds}</span>
            </div>

            {/* Baths */}
            <div className="flex items-center gap-1">
              <Bath size={16} className="text-gray-400" />
              <span className="font-medium">{property.baths}</span>
            </div>

            {/* Sqft */}
            <span className="font-medium">{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
