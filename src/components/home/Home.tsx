'use client';

import Header from '@/components/common/header';
import Hero from './hero';
import HeroCards from './HeroCards';
import PersonSection from './PersonSection';
import StatsSection from './StatsSection';
import FeaturedProperties from './FeaturedProperties';
import PopularNeighborhoods from './PopularNeighborhoods';
import HowItWorks from './HowItWorks';
import BenefitsSection from './BenefitsSection';
import Testimonials from './Testimonials';
import ContactSection from './ContactSection';
import Newsletter from './newsletter';
import InstagramGallery from './instagram';
import Footer from '@/components/common/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <HeroCards />
      <PersonSection />
      <StatsSection />
      <FeaturedProperties />
      <PopularNeighborhoods />
      <HowItWorks />
      <BenefitsSection />
      <Testimonials />
      <ContactSection />
      <Newsletter />
      <InstagramGallery />
      <Footer />
    </>
  );
}
