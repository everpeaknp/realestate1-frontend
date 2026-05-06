'use client';

import { useState, useEffect, ImgHTMLAttributes } from 'react';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  blurDataURL?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
  skeletonClassName?: string;
}

export default function LazyImage({
  src,
  alt,
  fallbackSrc = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
  blurDataURL,
  threshold = 0.01,
  rootMargin = '50px',
  onLoad,
  onError,
  className = '',
  skeletonClassName = '',
  style,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // Use fallback if src is empty or null
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset state when src changes
  useEffect(() => {
    if (src && src !== currentSrc) {
      setIsLoaded(false);
      setHasError(false);
      setCurrentSrc(src);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    console.error('Image failed to load:', currentSrc);
    console.error('Image error details:', {
      originalSrc: src,
      currentSrc,
      fallbackSrc,
      hasError,
    });
    
    // Only switch to fallback if original image fails
    if (currentSrc === (src || fallbackSrc) && !hasError) {
      console.log('Switching to fallback image:', fallbackSrc);
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      onError?.();
    } else {
      // Fallback also failed - still mark as loaded to remove skeleton
      console.error('Fallback image also failed, showing broken image');
      setIsLoaded(true);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  const imageStyle: React.CSSProperties = {
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const blurStyle: React.CSSProperties = blurDataURL
    ? {
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("${blurDataURL}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(20px)',
        transform: 'scale(1.1)',
        opacity: isLoaded ? 0 : 1,
        transition: 'opacity 0.3s ease-in-out',
      }
    : {};

  // Don't render if no valid src or not mounted yet
  if (!currentSrc || !isMounted) {
    return (
      <div style={containerStyle} className={className}>
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${skeletonClassName}`}
        />
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && <div style={blurStyle} />}

      {/* Skeleton loader - show while loading and not loaded */}
      {!isLoaded && !blurDataURL && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${skeletonClassName}`}
        />
      )}

      {/* Actual image - render with key to force re-render on src change */}
      <img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={imageStyle}
        className={className}
        {...props}
      />
    </div>
  );
}
