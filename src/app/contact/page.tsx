
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';
import ContactHero from '@/components/contact/contactHero';
import ContactCards from '@/components/contact/ContactCards';
import ContactFormSection from '@/components/contact/ContactFormSection';

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactHero />
      <ContactCards />
      <ContactFormSection />
      <ContactSection />
      <Newsletter />
      <Instagram />
      <Footer />
    </>
  );
}
