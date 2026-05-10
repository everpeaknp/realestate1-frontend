'use client';

import { useEffect } from 'react';

interface TawkChatProps {
  propertyId: string;
  widgetId: string;
}

/**
 * TawkChat Integration
 * ====================
 * Injects the Tawk.to live chat script dynamically based on admin settings.
 */
export default function TawkChat({ propertyId, widgetId }: TawkChatProps) {
  useEffect(() => {
    if (!propertyId || !widgetId) {
      console.warn('[Tawk.to] Missing Property ID or Widget ID');
      return;
    }

    // Prevent duplicate injection
    if (document.getElementById('tawk-script')) return;

    // Tawk.to initialization
    const s1 = document.createElement("script");
    s1.id = 'tawk-script';
    s1.async = true;
    s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    
    const s0 = document.getElementsByTagName("script")[0];
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }

    // Global variable for Tawk.to API
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    return () => {
      // Cleanup on unmount
      const script = document.getElementById('tawk-script');
      if (script) script.remove();
      
      // Attempt to hide/remove Tawk widget elements
      const tawkIframe = document.querySelector('iframe[title="chat widget"]');
      if (tawkIframe) tawkIframe.remove();
      
      const tawkMin = document.querySelector('.tawk-minified-wrapper');
      if (tawkMin) tawkMin.remove();
    };
  }, [propertyId, widgetId]);

  return null;
}
