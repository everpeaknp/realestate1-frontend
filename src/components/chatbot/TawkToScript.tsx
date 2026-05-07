'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export function TawkToScript() {
  const tawkToUrl = process.env.NEXT_PUBLIC_TAWK_TO_URL;

  useEffect(() => {
    // Suppress Tawk.to CORS errors in development (they're expected and don't affect functionality)
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      console.error = (...args) => {
        // Filter out Tawk.to CORS errors
        if (
          args[0]?.toString().includes('va.tawk.to') ||
          args[0]?.toString().includes('twk-chunk')
        ) {
          return;
        }
        originalError.apply(console, args);
      };

      return () => {
        console.error = originalError;
      };
    }
  }, []);

  // Don't render if URL is not configured
  if (!tawkToUrl) {
    console.warn('Tawk.to URL is not configured. Please set NEXT_PUBLIC_TAWK_TO_URL in your environment variables.');
    return null;
  }

  return (
    <>
      <Script
        id="tawk-to-script"
        strategy="lazyOnload"
        src={tawkToUrl}
        onLoad={() => {
          console.log('✅ Tawk.to chat widget loaded successfully');
        }}
        onError={(e) => {
          console.error('❌ Failed to load Tawk.to chat widget:', e);
        }}
      />
    </>
  );
}
