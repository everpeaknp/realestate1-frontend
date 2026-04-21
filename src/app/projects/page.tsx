
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import ProjectHero from '@/components/projects/projectHero';
import ProjectGallery from '@/components/projects/ProjectGallery';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <ProjectHero />
      <ProjectGallery />
      <ContactSection />
      <Newsletter />
      <Instagram />
      <Footer />
    </>
  );
}
