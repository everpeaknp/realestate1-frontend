import Home from '@/components/home';
import { homeAPI } from '@/lib/api';

export default async function HomePage() {
  // Fetch all home page data
  const [
    heroSettings,
    heroCards,
    howItWorks,
    neighborhoods,
    benefits,
    benefitGallery,
    benefitsContact,
    contactSection,
    instagram,
    personSection,
    stats
  ] = await Promise.all([
    homeAPI.getHeroSettings().catch(() => null),
    homeAPI.getHeroCards().catch(() => []),
    homeAPI.getHowItWorks().catch(() => []),
    homeAPI.getNeighborhoods().catch(() => []),
    homeAPI.getBenefits().catch(() => []),
    homeAPI.getBenefitGallery().catch(() => []),
    homeAPI.getBenefitsContact().catch(() => null),
    homeAPI.getContactSection().catch(() => null),
    homeAPI.getInstagram().catch(() => []),
    homeAPI.getPersonSection().catch(() => null),
    homeAPI.getStats().catch(() => [])
  ]);

  return (
    <Home
      heroSettings={heroSettings}
      heroCards={heroCards}
      howItWorks={howItWorks}
      neighborhoods={neighborhoods}
      benefits={benefits}
      benefitGallery={benefitGallery}
      benefitsContact={benefitsContact}
      contactSection={contactSection}
      instagram={instagram}
      personSection={personSection}
      stats={stats}
    />
  );
}
