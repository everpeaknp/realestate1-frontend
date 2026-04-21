'use client';

import Header from '@/components/common/header';
import Hero from './hero';
import HeroCards from '../shared/HeroCards';
import PersonSection from '../shared/PersonSection';

import FeaturedProperties from './FeaturedProperties';
import PopularNeighborhoods from './PopularNeighborhoods';
import HowItWorks from './HowItWorks';

import Testimonials from './Testimonials';
import ContactSection from '../shared/ContactSection';
import BenefitsSection from '../shared/BenefitsSection';
import Newsletter from '../shared/newsletter';
import StatsSection from '../shared/StatsSection';
import InstagramGallery from '../shared/instagram';
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
   <BenefitsSection/>
      <Testimonials />
      <ContactSection />
      <Newsletter />
      <InstagramGallery />
      <Footer />
    </>
  );
}
