import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import ServicesHero from '@/components/services/ServicesHero';
import BuyPropertySection from '@/components/services/BuyPropertySection';
import SellPropertySection from '@/components/services/SellPropertySection';
import RentPropertySection from '@/components/services/RentPropertySection';
import HomeLoanSection from '@/components/services/HomeLoanSection';
import StatsSection from '@/components/shared/StatsSection';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';

export default function ServicesPage() {
  return (
    <>
      <Header />
      <ServicesHero />
      <BuyPropertySection />
      <SellPropertySection />
      <RentPropertySection />
      <HomeLoanSection />
      <StatsSection />
      <ContactSection />
      <Newsletter />
      <Instagram />
      <Footer />
    </>
  );
}
