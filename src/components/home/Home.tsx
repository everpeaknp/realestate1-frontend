'use client';

import Hero from './hero';
import HeroCards from '../shared/HeroCards';
import PersonSection from '../shared/PersonSection';
import FeaturedProperties from './FeaturedProperties';
import SingleFeaturedProperty from './SingleFeaturedProperty';
import SoldGallery from './SoldGallery';
import PopularNeighborhoods from './PopularNeighborhoods';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import ContactSection from '../shared/ContactSection';
import BenefitsSection from '../shared/BenefitsSection';
import Newsletter from '../shared/newsletter';
import StatsSection from '../shared/StatsSection';
import InstagramGallery from '../shared/instagram';

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
      <Hero settings={heroSettings} />
 
      <SingleFeaturedProperty />
      <FeaturedProperties />
      <SoldGallery />

      <PopularNeighborhoods neighborhoods={neighborhoods} />
      <HowItWorks steps={howItWorks} />
  
      <Testimonials />
        <StatsSection stats={stats} />
      <BenefitsSection 
        benefits={benefits}
        gallery={benefitGallery}
        section={benefitsSection}
      />    
            <InstagramGallery />
      <ContactSection settings={contactSection} />
 

          <Newsletter />
      
    </>
  );
}
