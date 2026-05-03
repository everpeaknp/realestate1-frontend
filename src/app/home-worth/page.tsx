import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import MyHomeWorth from '@/components/homeworth/MyHomeWorth';

export const metadata = {
  title: "What's My Home Worth? | Free Property Valuation | Lily White Realestate",
  description: 'Get a free, accurate valuation of your property. Discover your home\'s true market value with expert analysis from Boston\'s trusted realtor.',
};

export default function HomeWorthPage() {
  return (
    <>
      <Header />
      <main>
        <MyHomeWorth />
      </main>
      <Footer />
    </>
  );
}
