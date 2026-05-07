'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { cmsAPI } from '@/lib/api';

interface NavigationLink {
  id: number;
  name: string;
  href: string;
  order: number;
  is_active: boolean;
}

interface HeaderSettings {
  id: number;
  logo_image: string | null;
  logo_text: string;
  phone_number: string;
  favicon: string | null;
  site_name: string;
  is_active: boolean;
  navigation_links: NavigationLink[];
}

interface FooterLink {
  id: number;
  name: string;
  href: string;
  order: number;
  is_active: boolean;
}

interface FooterSettings {
  id: number;
  logo_image: string | null;
  logo_text: string;
  phone_number: string;
  email: string;
  copyright_text: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;
  is_active: boolean;
  footer_links: FooterLink[];
}

interface CMSContextType {
  headerSettings: HeaderSettings | null;
  footerSettings: FooterSettings | null;
  loading: boolean;
}

const CMSContext = createContext<CMSContextType>({
  headerSettings: null,
  footerSettings: null,
  loading: true,
});

export function CMSProvider({ children }: { children: ReactNode }) {
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings | null>(null);
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCMSData = async () => {
      console.log('=== CMSContext: Starting to fetch CMS data ===');
      try {
        console.log('Fetching header and footer settings...');
        const [headerData, footerData] = await Promise.all([
          cmsAPI.getHeaderSettings(),
          cmsAPI.getFooterSettings()
        ]);
        
        console.log('Header Data received:', headerData);
        console.log('Footer Data received:', footerData);
        
        // API returns array, get first active item
        const activeHeader = headerData.find((h: HeaderSettings) => h.is_active);
        const activeFooter = footerData.find((f: FooterSettings) => f.is_active);
        
        const selectedHeader = activeHeader || headerData[0] || null;
        const selectedFooter = activeFooter || footerData[0] || null;
        
        console.log('Selected Header Settings:', selectedHeader);
        console.log('Selected Footer Settings:', selectedFooter);
        
        setHeaderSettings(selectedHeader);
        setFooterSettings(selectedFooter);
        
        console.log('✅ CMS data successfully loaded');
      } catch (error) {
        console.error('❌ Error fetching CMS data:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
      } finally {
        setLoading(false);
        console.log('=== CMSContext: Fetch complete ===');
      }
    };

    fetchCMSData();
  }, []);

  return (
    <CMSContext.Provider value={{ headerSettings, footerSettings, loading }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
