'use client';

import { useEffect } from 'react';

export function TawkToChat() {
  useEffect(() => {
    const tawkToUrl = process.env.NEXT_PUBLIC_TAWK_TO_URL;

    // Don't load if URL is not configured
    if (!tawkToUrl) {
      console.warn('Tawk.to URL is not configured. Please set NEXT_PUBLIC_TAWK_TO_URL in your environment variables.');
      return;
    }

    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="${tawkToUrl}"]`);
    if (existingScript) {
      return;
    }

    // Initialize Tawk_API before loading script
    if (typeof window !== 'undefined') {
      (window as any).Tawk_API = (window as any).Tawk_API || {};
      (window as any).Tawk_LoadStart = new Date();
    }

    // Load Tawk.to script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = tawkToUrl;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Append to document head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      const scriptToRemove = document.querySelector(`script[src="${tawkToUrl}"]`);
      if (scriptToRemove) {
        try {
          // Use remove() instead of parentNode.removeChild() to avoid null reference
          scriptToRemove.remove();
        } catch (error) {
          // Silently fail if element is already removed
          console.debug('TawkTo script already removed');
        }
      }
      
      // Clean up Tawk API
      if (typeof window !== 'undefined') {
        delete (window as any).Tawk_API;
        delete (window as any).Tawk_LoadStart;
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}
