'use client';
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

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
            <PersonSection />
            <ServicesProvideSection/>
        <HeroCards />
    
        <BenefitsSection />
        <StatsSection />
            <GoalsSection />
        <ContactSection />
        <Newsletter />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}
