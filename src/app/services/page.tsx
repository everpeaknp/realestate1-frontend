'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import ServicesHero from '@/components/services/ServicesHero';
import BuyPropertySection from '@/components/services/BuyPropertySection';
import SellPropertySection from '@/components/services/SellPropertySection';
import RentPropertySection from '@/components/services/RentPropertySection';
 
import StatsSection from '@/components/shared/StatsSection';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';
import { API_ENDPOINTS } from '@/lib/api';

interface ServiceFeature {
  id: number;
  text: string;
  order: number;
}

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  layout: 'IMAGE_LEFT' | 'IMAGE_RIGHT';
  phone: string;
  email: string;
  button_text: string;
  features: ServiceFeature[];
  is_active: boolean;
  order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Record<string, Service>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.services.list);
        const data = await response.json();
        
        // Convert array to object keyed by slug for easy lookup
        const servicesMap: Record<string, Service> = {};
        (data.results || []).forEach((service: Service) => {
          servicesMap[service.slug] = service;
        });
        
        setServices(servicesMap);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get service data or use defaults
  const buyProperty = services['buy-property'];
  const sellProperty = services['sell-property'];
  const rentProperty = services['rent-property'];
  const homeLoan = services['home-loan'];

  return (
    <>
      <Header />
      <ServicesHero />
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-[#7C7A70] text-lg">Loading services...</div>
        </div>
      ) : (
        <>
          <BuyPropertySection
            title={buyProperty?.title}
            description={buyProperty?.description}
            image={buyProperty?.image}
            phone={buyProperty?.phone}
            email={buyProperty?.email}
            buttonText={buyProperty?.button_text}
            features={buyProperty?.features}
          />
          <SellPropertySection
            title={sellProperty?.title}
            description={sellProperty?.description}
            image={sellProperty?.image}
            phone={sellProperty?.phone}
            email={sellProperty?.email}
            buttonText={sellProperty?.button_text}
            features={sellProperty?.features}
          />
          <RentPropertySection
            title={rentProperty?.title}
            description={rentProperty?.description}
            image={rentProperty?.image}
            phone={rentProperty?.phone}
            email={rentProperty?.email}
            buttonText={rentProperty?.button_text}
            features={rentProperty?.features}
          />
          
        </>
      )}
      <StatsSection />
      <ContactSection />
      <Newsletter />
      <Instagram />
      <Footer />
    </>
  );
}
