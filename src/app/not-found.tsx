'use client';

import { useRouter } from 'next/navigation';
import NotFoundPage from '@/components/404';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
 
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';

export default function NotFound() {
  const router = useRouter();

  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <>
      <Header />
      <NotFoundPage onBackHome={handleBackHome} />
 
      <Newsletter />
      <Instagram />
      <Footer />
    </>
  );
}
