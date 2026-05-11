

import TestimonialsHero from '@/components/testimonials/testimonialsHero';
import VideoTestimonials from '@/components/testimonials/VideoTestimonials';
import Testimonials from '@/components/testimonials/Testimonials';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';

export default function TestimonialsPage() {
  return (
    <>
      
      <TestimonialsHero />
      <VideoTestimonials />
      <Testimonials/>
      <ContactSection />
      <Newsletter />
      <Instagram />
      
    </>
  );
}
