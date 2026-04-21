import { SingleProperty } from '@/components/properties';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';

export default function SinglePropertyPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Header />
      <SingleProperty slug={params.slug} />
      <Footer />
    </>
  );
}
