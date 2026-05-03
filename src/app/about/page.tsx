'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import AboutHero from '@/components/about/AboutHero';
import ServicesProvideSection from '@/components/about/ServicesProvideSection';
import GoalsSection from '@/components/about/GoalsSection';
import HeroCards from '@/components/shared/HeroCards';
import PersonSection from '@/components/shared/PersonSection';
import BenefitsSection from '@/components/shared/BenefitsSection';
import StatsSection from '@/components/shared/StatsSection';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';
import { aboutAPI } from '@/lib/api';

interface Goal {
  id: number;
  title: string;
  description: string;
  order: number;
  is_active: boolean;
}

interface ServicesProvide {
  id: number;
  subtitle: string;
  title: string;
  background_image: string;
  is_active: boolean;
}

export default function AboutPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [servicesProvide, setServicesProvide] = useState<ServicesProvide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [goalsData, servicesProvideData] = await Promise.all([
          aboutAPI.getGoals(),
          aboutAPI.getServicesProvide()
        ]);
        
        setGoals(goalsData);
        // API returns array, get first active item
        const activeServicesProvide = servicesProvideData.find((sp: ServicesProvide) => sp.is_active);
        setServicesProvide(activeServicesProvide || servicesProvideData[0] || null);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <PersonSection />
        {!loading && servicesProvide && (
          <ServicesProvideSection
            subtitle={servicesProvide.subtitle}
            title={servicesProvide.title}
            backgroundImage={servicesProvide.background_image}
          />
        )}
        {loading && <ServicesProvideSection />}
        <HeroCards />
        <BenefitsSection />
        <StatsSection />
        {!loading && <GoalsSection goals={goals} />}
        {loading && <GoalsSection />}
        <ContactSection />
        <Newsletter />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}
