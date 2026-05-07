'use client';

import { useEffect } from 'react';
import { useCMS } from '@/contexts/CMSContext';

export function DynamicMetadata() {
  const { headerSettings } = useCMS();

  useEffect(() => {
    console.log('DynamicMetadata - Header Settings:', headerSettings);
    
    if (headerSettings) {
      // Update document title
      if (headerSettings.site_name) {
        console.log('Updating document title to:', headerSettings.site_name);
        document.title = headerSettings.site_name;
      }

      // Update or create favicon link
      if (headerSettings.favicon) {
        console.log('Updating favicon to:', headerSettings.favicon);
        
        // Remove existing favicon links
        const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
        console.log('Removing existing favicons:', existingFavicons.length);
        existingFavicons.forEach(link => link.remove());

        // Add new favicon
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = headerSettings.favicon;
        document.head.appendChild(link);
        console.log('Added new favicon link');

        // Add apple-touch-icon for iOS
        const appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        appleLink.href = headerSettings.favicon;
        document.head.appendChild(appleLink);
        console.log('Added apple-touch-icon');
      } else {
        console.log('No favicon URL provided');
      }
    } else {
      console.log('No header settings available yet');
    }
  }, [headerSettings]);

  return null;
}
