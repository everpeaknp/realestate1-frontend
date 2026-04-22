/**
 * API Configuration
 * Centralized API URL management using environment variables
 */

// Get API URL from environment variable with fallback
// For server-side rendering, we need to check both client and server env
// Using 127.0.0.1 instead of localhost for better SSR compatibility
const getApiUrl = () => {
  // Check client-side env var first
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  }
  // Server-side: check both NEXT_PUBLIC and regular env vars
  return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://127.0.0.1:8000';
};

export const API_URL = getApiUrl();

// API Endpoints
export const API_ENDPOINTS = {
  // Chatbot
  chatbot: {
    chat: `${API_URL}/api/chatbot/chat/`,
    history: (sessionId: string) => `${API_URL}/api/chatbot/history/?session_id=${sessionId}`,
    clearSession: (sessionId: string) => `${API_URL}/api/chatbot/clear_session/?session_id=${sessionId}`,
    health: `${API_URL}/api/chatbot/health/`,
  },
  
  // Leads
  leads: {
    contact: `${API_URL}/api/leads/contact/`,
    propertyInquiry: `${API_URL}/api/leads/property-inquiry/`,
    valuation: `${API_URL}/api/leads/valuation/`,
    newsletter: `${API_URL}/api/newsletter/`,
  },
  
  // Properties
  properties: {
    list: `${API_URL}/api/properties/`,
    detail: (slug: string) => `${API_URL}/api/properties/${slug}/`,
    featured: `${API_URL}/api/properties/featured/`,
    forSale: `${API_URL}/api/properties/for_sale/`,
    forRent: `${API_URL}/api/properties/for_rent/`,
  },
  
  // Blog
  blog: {
    list: `${API_URL}/api/blog/posts/`,
    detail: (slug: string) => `${API_URL}/api/blog/posts/${slug}/`,
    comments: `${API_URL}/api/blog/comments/`,
    createComment: `${API_URL}/api/blog/comments/`,
  },
  
  // Testimonials
  testimonials: {
    list: `${API_URL}/api/testimonials/`,
  },
  
  // Projects
  projects: {
    list: `${API_URL}/api/projects/`,
  },
  
  // FAQs
  faqs: {
    list: `${API_URL}/api/faqs/`,
  },
  
  // Agents
  agents: {
    list: `${API_URL}/api/agents/`,
    detail: (id: number) => `${API_URL}/api/agents/${id}/`,
  },
};

/**
 * Helper function to make API requests with error handling
 */
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

/**
 * Check if API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/chatbot/health/`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}
