'use client';

import { useEffect, useRef } from 'react';
import { useCMS } from '@/contexts/CMSContext';

export function DynamicMetadata() {
  const { headerSettings, loading } = useCMS();
  const hasUpdatedRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Prevent SSR execution
    if (typeof window === 'undefined') return;
    
    // Prevent multiple executions
    if (hasUpdatedRef.current) {
      console.log('DynamicMetadata already updated, skipping...');
      return;
    }
    
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
      
      // NUCLEAR OPTION: Don't remove existing favicons, just add new ones
      // This completely avoids any removeChild issues
      const newLinks: HTMLLinkElement[] = [];
      
      try {
        // Add new favicon
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.href = headerSettings.favicon;
        link.dataset.dynamicFavicon = 'true'; // Mark as our favicon
        document.head.appendChild(link);
        newLinks.push(link);
        console.log(`✅ Added new favicon link: ${headerSettings.favicon}`);

        // Add apple-touch-icon for iOS
        const appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        appleLink.href = headerSettings.favicon;
        appleLink.dataset.dynamicFavicon = 'true';
        document.head.appendChild(appleLink);
        newLinks.push(appleLink);
        console.log(`✅ Added apple-touch-icon: ${headerSettings.favicon}`);

        // Add shortcut icon for better browser compatibility
        const shortcutLink = document.createElement('link');
        shortcutLink.rel = 'shortcut icon';
        shortcutLink.href = headerSettings.favicon;
        shortcutLink.dataset.dynamicFavicon = 'true';
        document.head.appendChild(shortcutLink);
        newLinks.push(shortcutLink);
        console.log(`✅ Added shortcut icon: ${headerSettings.favicon}`);

        // Verify the links were added
        const allFavicons = document.querySelectorAll('link[rel*="icon"]');
        console.log(`✅ Total favicon links after update: ${allFavicons.length}`);
        allFavicons.forEach(link => {
          console.log(`  - ${link.getAttribute('rel')}: ${link.getAttribute('href')}`);
        });

        // Store cleanup function
        cleanupRef.current = () => {
          console.log('🧹 Cleaning up dynamic favicons...');
          newLinks.forEach(link => {
            try {
              if (link.parentNode) {
                link.parentNode.removeChild(link);
              }
            } catch (e) {
              console.debug('Cleanup: link already removed');
            }
          });
        };
      } catch (error) {
        console.error('Error adding favicons:', error);
      }
    } else {
      console.warn('⚠️ No favicon URL provided in header settings');
    }

    // Mark as updated
    hasUpdatedRef.current = true;
    console.log('=== DynamicMetadata Update Complete ===');

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [headerSettings, loading]);

  return null;
}
