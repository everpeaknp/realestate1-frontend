'use client';

import { useEffect } from 'react';
import { useCMS } from '@/contexts/CMSContext';

export function DynamicMetadata() {
  const { headerSettings, loading } = useCMS();

  useEffect(() => {
    console.log('=== DynamicMetadata Component Mounted ===');
    console.log('Loading:', loading);
    console.log('Header Settings:', headerSettings);
    
    if (loading) {
      console.log('Still loading CMS data...');
      return;
    }
    
    if (!headerSettings) {
      console.warn('⚠️ No header settings available after loading completed');
      return;
    }

    console.log('✅ Header settings loaded successfully');
    console.log('Site Name:', headerSettings.site_name);
    console.log('Favicon URL:', headerSettings.favicon);

    // Update document title
    if (headerSettings.site_name) {
      const oldTitle = document.title;
      document.title = headerSettings.site_name;
      console.log(`✅ Document title updated: "${oldTitle}" → "${headerSettings.site_name}"`);
    } else {
      console.warn('⚠️ No site_name provided in header settings');
    }

    // Update or create favicon link
    if (headerSettings.favicon) {
      console.log('🔄 Updating favicon...');
      
      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      console.log(`Removing ${existingFavicons.length} existing favicon link(s)`);
      existingFavicons.forEach(link => {
        console.log(`  - Removing: ${link.getAttribute('rel')} - ${link.getAttribute('href')}`);
        link.remove();
      });

      // Add new favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png'; // Changed from image/x-icon to image/png
      link.href = headerSettings.favicon;
      document.head.appendChild(link);
      console.log(`✅ Added new favicon link: ${headerSettings.favicon}`);

      // Add apple-touch-icon for iOS
      const appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = headerSettings.favicon;
      document.head.appendChild(appleLink);
      console.log(`✅ Added apple-touch-icon: ${headerSettings.favicon}`);

      // Add shortcut icon for better browser compatibility
      const shortcutLink = document.createElement('link');
      shortcutLink.rel = 'shortcut icon';
      shortcutLink.href = headerSettings.favicon;
      document.head.appendChild(shortcutLink);
      console.log(`✅ Added shortcut icon: ${headerSettings.favicon}`);

      // Verify the links were added
      const newFavicons = document.querySelectorAll('link[rel*="icon"]');
      console.log(`✅ Total favicon links after update: ${newFavicons.length}`);
      newFavicons.forEach(link => {
        console.log(`  - ${link.getAttribute('rel')}: ${link.getAttribute('href')}`);
      });
    } else {
      console.warn('⚠️ No favicon URL provided in header settings');
    }

    console.log('=== DynamicMetadata Update Complete ===');
  }, [headerSettings, loading]);

  return null;
}
