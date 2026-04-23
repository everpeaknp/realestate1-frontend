'use client';

import HomeWorthHero from './HomeWorthHero';
import HomeWorthForm from './HomeWorthForm';
import PersonSection from '../shared/PersonSection';
import StatsSection from '../shared/StatsSection';
import InstagramGallery from '../shared/instagram';

export default function MyHomeWorth() {
  return (
    <div className="min-h-screen">
      <HomeWorthHero />
      <HomeWorthForm />
      <PersonSection />
      <StatsSection />
      <InstagramGallery />
    </div>
  );
}
