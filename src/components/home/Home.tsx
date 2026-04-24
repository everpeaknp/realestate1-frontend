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

interface HomeProps {
  heroSettings: any;
  heroCards: any[];
  howItWorks: any[];
  neighborhoods: any[];
  benefits: any[];
  benefitGallery: any[];
  benefitsSection: any;
  contactSection: any;
  instagram: any[];
  personSection: any;
  stats: any[];
}

export default function Home({
  heroSettings,
  heroCards,
  howItWorks,
  neighborhoods,
  benefits,
  benefitGallery,
  benefitsSection,
  contactSection,
  instagram,
  personSection,
  stats
}: HomeProps) {
  return (
    <>
      <Header />
      <Hero settings={heroSettings} />
      <HeroCards cards={heroCards} />
      <PersonSection settings={personSection} />
      <StatsSection stats={stats} />
      <FeaturedProperties />
      <PopularNeighborhoods neighborhoods={neighborhoods} />
      <HowItWorks steps={howItWorks} />
      <BenefitsSection 
        benefits={benefits}
        gallery={benefitGallery}
        section={benefitsSection}
      />
      <Testimonials />
      <ContactSection settings={contactSection} />
      <Newsletter />
      <InstagramGallery images={instagram} />
      <Footer />
    </>
  );
}
