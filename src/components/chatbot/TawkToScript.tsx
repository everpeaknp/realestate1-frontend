'use client';

import Script from 'next/script';

export function TawkToScript() {
  const tawkToUrl = process.env.NEXT_PUBLIC_TAWK_TO_URL;

  // Don't render if URL is not configured
  if (!tawkToUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Tawk.to URL is not configured. Please set NEXT_PUBLIC_TAWK_TO_URL in your environment variables.');
    }
    return null;
  }

  return (
    <Script
      id="tawk-to-script"
      strategy="lazyOnload"
      src={tawkToUrl}
      onLoad={() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Tawk.to chat widget loaded successfully');
        }
      }}
      onError={(e) => {
        console.error('❌ Failed to load Tawk.to chat widget:', e);
      }}
    />
  );
}
