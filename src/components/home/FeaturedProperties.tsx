'use client';

import { ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { EagleProperty } from '@/lib/eagle-api';

// ─── Carousel config ──────────────────────────────────────────────────────────
const SCROLL_SPEED = 0.5;
const CARD_WIDTH = 320;
const CARD_GAP = 24;
const MOMENTUM_FRICTION = 0.95;
const MOMENTUM_MIN_VELOCITY = 0.1;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(property: EagleProperty): string {
  if (property.advertisedPrice) return property.advertisedPrice;
  if (property.price) {
    return '$' + property.price.toLocaleString('en-AU', { maximumFractionDigits: 0 });
  }
  return 'Contact for price';
}

function getPropertyImage(property: EagleProperty): string {
  if (property.thumbnailSquare) return property.thumbnailSquare;
  if (property.images && property.images.length > 0) return property.images[0].url;
  return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800';
}

function getStatusLabel(status?: string): string {
  if (!status) return 'FOR SALE';
  return status.replace(/_/g, ' ').toUpperCase();
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<EagleProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedProperties, setDisplayedProperties] = useState<EagleProperty[]>([]);
  const [translateX, setTranslateX] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const isDraggingRef = useRef(false);
  const isAutoScrollingRef = useRef(true);
  const currentTranslateRef = useRef(0);
  const velocityRef = useRef(0);
  const startXRef = useRef(0);
  const dragStartTranslateRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const cardWidthWithGapRef = useRef(CARD_WIDTH + CARD_GAP);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const router = useRouter();

  // Fetch latest properties from Eagle API via our secure Next.js route
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest 20 properties (sorted by createdAt desc on the API side)
        const res = await fetch('/api/eagle/properties?limit=20');
        const data = await res.json();

        if (data.success && Array.isArray(data.properties) && data.properties.length > 0) {
          // Sort by createdAt descending to show latest first
          const sorted = [...data.properties].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });

          setProperties(sorted);
          // Duplicate 3x for seamless infinite loop
          setDisplayedProperties([...sorted, ...sorted, ...sorted]);
        }
      } catch (err) {
        console.error('Failed to fetch Eagle properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Main animation loop
  useEffect(() => {
    const animate = () => {
      if (isAutoScrollingRef.current && !isDraggingRef.current && !isHovering) {
        currentTranslateRef.current -= SCROLL_SPEED;
      }

      if (velocityRef.current !== 0 && !isDraggingRef.current) {
        currentTranslateRef.current += velocityRef.current;
        velocityRef.current *= MOMENTUM_FRICTION;
        if (Math.abs(velocityRef.current) < MOMENTUM_MIN_VELOCITY) {
          velocityRef.current = 0;
        }
      }

      if (properties.length > 0) {
        const singleSetWidth = properties.length * cardWidthWithGapRef.current;
        if (currentTranslateRef.current <= -(singleSetWidth * 3)) {
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
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isHovering, properties.length]);

  // Drag handlers
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
    const dragDelta = currentTranslateRef.current - dragStartTranslateRef.current;
    velocityRef.current = dragDelta * 0.1;
    setTimeout(() => { isAutoScrollingRef.current = true; }, 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) handleMouseUp();
    setIsHovering(false);
  }, [handleMouseUp]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleMouseDown(e.touches[0] as unknown as React.MouseEvent);
  }, [handleMouseDown]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMouseMove(e.touches[0] as unknown as React.MouseEvent);
  }, [handleMouseMove]);

  const handleCardClick = useCallback((id: string) => {
    if (dragDistanceRef.current < 5) {
      router.push(`/properties/${id}`);
    }
  }, [router]);

  if (loading) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="h-4 w-36 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-80 flex-shrink-0 h-72 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayedProperties.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Latest Listings</h2>
            <p className="text-gray-600">Our most recently added properties</p>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-1 transition-opacity hover:opacity-80"
            style={{ color: '#C1A478' }}
          >
            View all <ChevronRight size={16} />
          </Link>
        </div>

        {/* Carousel */}
        <div
          className="overflow-hidden rounded-lg cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setIsHovering(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <div
            className="flex gap-6 will-change-transform"
            style={{ transform: `translateX(${translateX}px)`, transition: 'none' }}
          >
            {displayedProperties.map((property, idx) => (
              <PropertyCard
                key={`${property.id}-${idx}`}
                property={property}
                onClick={() => handleCardClick(property.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Property Card ────────────────────────────────────────────────────────────

interface PropertyCardProps {
  property: EagleProperty;
  onClick: () => void;
}

function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <div className="w-80 flex-shrink-0 cursor-grab group" onClick={onClick}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="h-52 bg-gray-200 relative overflow-hidden">
          <img
            src={getPropertyImage(property)}
            alt={property.formattedAddress}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            draggable={false}
            referrerPolicy="no-referrer"
          />

          {/* Status ribbon */}
          <div className="absolute top-0 left-0 overflow-hidden w-24 h-24 z-10">
            <div
              className="absolute top-3 -left-8 w-36 py-1 text-center text-[10px] font-bold tracking-widest text-white shadow-lg transform -rotate-45"
              style={{ backgroundColor: '#C1A478' }}
            >
              {getStatusLabel(property.status)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3
            className="font-semibold text-gray-900 truncate transition-colors group-hover:text-[#C1A478]"
          >
            {property.headline || property.formattedAddress}
          </h3>

          <div className="flex items-center gap-1 text-sm text-gray-500 truncate mt-1 mb-2">
            <MapPin size={13} className="flex-shrink-0 text-[#C1A478]" />
            <span className="truncate">{property.formattedAddress}</span>
          </div>

          <p className="text-lg font-bold text-gray-900 mb-2">
            {formatPrice(property)}
          </p>

          {property.landSize && (
            <p className="text-xs text-gray-500">
              Land: {property.landSize}{property.landSizeUnits ? ` ${property.landSizeUnits}` : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
