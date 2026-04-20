import { SingleProperty } from '@/components/properties';

export default function SinglePropertyPage({ params }: { params: { slug: string } }) {
  return <SingleProperty slug={params.slug} />;
}
