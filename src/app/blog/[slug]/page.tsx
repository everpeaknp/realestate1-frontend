import { SinglePost } from '@/components/blog';

export default function SinglePostPage({ params }: { params: { slug: string } }) {
  return <SinglePost slug={params.slug} />;
}
