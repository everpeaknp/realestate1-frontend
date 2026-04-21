import PropertiesHero from '@/components/properties/PropertiesHero';
import AboutProperty from '@/components/properties/AboutProperty';
import PropertyList from '@/components/properties/PropertyList';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';

export default function PropertiesPage() {
  return (
    <>
      <Header />
      <PropertiesHero />
      <AboutProperty />
      <PropertyList />
      <ContactSection />
      <Newsletter />
      <Footer />
    </>
  );
}
