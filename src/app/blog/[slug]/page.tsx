import { SinglePost } from '@/components/blog';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';

export default function SinglePostPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Header />
      <SinglePost slug={params.slug} />
      <Footer />
    </>
  );
}
