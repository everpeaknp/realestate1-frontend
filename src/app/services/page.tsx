import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import StatsSection from '@/components/shared/StatsSection';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';

export default function ServicesPage() {
  return (
    <>
      <Header />
      <StatsSection />
      <ContactSection />
      <Newsletter />
      <Instagram />
      <Footer />
    </>
  );
}
