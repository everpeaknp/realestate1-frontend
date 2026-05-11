'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${isHome ? '' : 'pt-20 md:pt-24'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
