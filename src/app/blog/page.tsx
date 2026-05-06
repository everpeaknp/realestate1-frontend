import BlogHero from '@/components/blog/BlogHero';
import Header from '@/components/common/header';
import Footer from '@/components/common/Footer';
import Newsletter from '@/components/shared/newsletter';
import Instagram from '@/components/shared/instagram';
import PropertySidebar from '@/components/shared/PropertySidebar';
import BlogList from '@/components/blog/BlogList';

export const metadata = {
  title: 'Blog | Real Estate Tips & Insights | Lily White Realestate',
  description: "Discover expert real estate advice, market insights, and home buying tips from Boston's trusted realtor.",
};

async function getDefaultAgent() {
  try {
    // Use localhost for server-side API calls
    const apiUrl = 'http://localhost:8000';
    console.log('Fetching agent from:', `${apiUrl}/api/agents/`);
    
    const res = await fetch(`${apiUrl}/api/agents/`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.error('Failed to fetch agents, status:', res.status);
      return null;
    }
    
    const data = await res.json();
    console.log('Agent API response:', JSON.stringify(data, null, 2));
    
    // Handle paginated response
    const agents = data.results || data;
    
    // Return the first agent if available
    if (agents && agents.length > 0) {
      const agent = agents[0];
      console.log('Selected agent:', agent);
      return {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        avatar: agent.avatar, // Already includes full URL from serializer
        bio: agent.bio || 'Real Estate Agent',
      };
    }
    
    console.log('No agents found in response');
    return null;
  } catch (error) {
    console.error('Error fetching agent:', error);
    return null;
  }
}

export default async function BlogPage() {
  const agent = await getDefaultAgent();
  
  // Debug logging
  console.log('Blog page - Agent data:', agent);
  
  return (
    <>
      <Header />
      <BlogHero />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">
          <div className="lg:col-span-8">
            <BlogList />
          </div>
          <div className="lg:col-span-4 sticky top-24">
            <PropertySidebar agent={agent || undefined} />
          </div>
        </div>
        <Newsletter />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}
