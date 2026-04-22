import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import FAQsHero from '@/components/faqs/faqsHero';
import FAQSection from '@/components/faqs/FAQSection';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';

export default function FAQsPage() {
  return (
    <>
      <Header />
      <FAQsHero />
      <FAQSection />
      <ContactSection />
      <Newsletter />
      <Instagram />
      <Footer />
    </>
  );
}
