import SinglePropertyHero from '@/components/properties/single-property/SinglePropertyHero';
import PropertyDescription from '@/components/properties/single-property/PropertyDescription';
import PropertyGallery from '@/components/properties/single-property/PropertyGallery';
import PropertyFeatures from '@/components/properties/single-property/PropertyFeatures';
import PropertyFloorPlan from '@/components/properties/single-property/PropertyFloorPlan';
import PropertySidebar from '@/components/shared/PropertySidebar';
import ContactSection from '@/components/shared/ContactSection';
import Newsletter from '@/components/shared/newsletter';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';

interface PropertyData {
  id: number;
  slug: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  location: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    display: string;
  };
  latitude: string | null;
  longitude: string | null;
  price: string;
  property_type: string;
  status: string;
  beds: number;
  baths: number;
  garage: number;
  sqft: number;
  year_built: number | null;
  lot_size: number | null;
  main_image: string | null;
  floor_plan: string | null;
  amenities_list: string[];
  is_featured: boolean;
  images: Array<{
    id: number;
    image: string;
    caption: string;
    order: number;
  }>;
  agent_name: string | null;
  agent_email: string | null;
  agent_phone: string | null;
  agent_avatar: string | null;
  agent_bio: string | null;
  created_at: string;
  updated_at: string;
}

async function getProperty(slug: string): Promise<PropertyData | null> {
  try {
    // Hardcoded for SSR reliability - environment variables can be unreliable in server components
    const apiUrl = 'http://127.0.0.1:8000';
    const url = `${apiUrl}/api/properties/${slug}/`;
    
    console.log('Fetching property from:', url);
    console.log('Environment API URL:', process.env.NEXT_PUBLIC_API_URL);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    console.log('Response status:', response.status);
    console.log('Response URL:', response.url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch property:', response.status, response.statusText);
      console.error('Error response:', errorText);
      return null;
    }
    
    const data = await response.json();
    console.log('Property data received:', data.title);
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
}

export default async function SinglePropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return (
      <>
        <Header />
        <main className="bg-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600">The property you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Extract agent data from property
  const agent = property.agent_name ? {
    name: property.agent_name,
    email: property.agent_email || 'hello@example.com',
    phone: property.agent_phone || '+1 (321) 456 7890',
    avatar: property.agent_avatar || 'https://www.realtorpal.hocud.com/wp-content/uploads/Realtor-Pal-Main-Agent-pro.png',
    bio: property.agent_bio || 'Real Estate Agent'
  } : undefined;

  return (
    <>
      <Header />
      <SinglePropertyHero property={property} />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <PropertyDescription property={property} />
            <PropertyGallery property={property} />
            <PropertyFeatures property={property} />
            <PropertyFloorPlan property={property} />
          </div>
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <PropertySidebar agent={agent} propertySlug={slug} />
            </div>
          </div>
        </div>
      
        <ContactSection />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
