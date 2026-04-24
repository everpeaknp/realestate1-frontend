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
  
  // Services
  services: {
    list: `${API_URL}/api/services/`,
    detail: (slug: string) => `${API_URL}/api/services/${slug}/`,
  },
  
  // About
  about: {
    goals: `${API_URL}/api/about/goals/`,
    servicesProvide: `${API_URL}/api/about/services-provide/`,
  },
  
  // Contact
  contact: {
    cards: `${API_URL}/api/contact/cards/`,
    formSettings: `${API_URL}/api/contact/form-settings/`,
  },
  
  // CMS
  cms: {
    headerSettings: `${API_URL}/api/cms/header-settings/`,
    navigationLinks: `${API_URL}/api/cms/navigation-links/`,
    footerSettings: `${API_URL}/api/cms/footer-settings/`,
    footerLinks: `${API_URL}/api/cms/footer-links/`,
    newsletterSettings: `${API_URL}/api/cms/newsletter-settings/`,
    propertySidebarSettings: `${API_URL}/api/cms/property-sidebar-settings/`,
  },
  
  // Home
  home: {
    heroSettings: `${API_URL}/api/home/hero-settings/`,
    heroCards: `${API_URL}/api/home/hero-cards/`,
    howItWorks: `${API_URL}/api/home/how-it-works/`,
    neighborhoods: `${API_URL}/api/home/neighborhoods/`,
    benefits: `${API_URL}/api/home/benefits/`,
    benefitGallery: `${API_URL}/api/home/benefit-gallery/`,
    benefitsSection: `${API_URL}/api/home/benefits-section/`,
    contactSection: `${API_URL}/api/home/contact-section/`,
    instagram: `${API_URL}/api/home/instagram/`,
    personSection: `${API_URL}/api/home/person-section/`,
    stats: `${API_URL}/api/home/stats/`,
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

/**
 * About API functions
 */
export const aboutAPI = {
  async getGoals() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.about.goals);
    return response.results;
  },
  
  async getServicesProvide() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.about.servicesProvide);
    return response.results;
  },
};

/**
 * Contact API functions
 */
export const contactAPI = {
  async getCards() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.contact.cards);
    return response.results;
  },
  
  async getFormSettings() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.contact.formSettings);
    return response.results;
  },
};

/**
 * CMS API functions
 */
export const cmsAPI = {
  async getHeaderSettings() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.cms.headerSettings);
    return response.results;
  },
  
  async getNavigationLinks() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.cms.navigationLinks);
    return response.results;
  },
  
  async getFooterSettings() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.cms.footerSettings);
    return response.results;
  },
  
  async getFooterLinks() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.cms.footerLinks);
    return response.results;
  },
  
  async getNewsletterSettings() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.cms.newsletterSettings);
    return response.results;
  },
  
  async getPropertySidebarSettings() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.cms.propertySidebarSettings);
    return response.results;
  },
};

/**
 * Home API functions
 */
export const homeAPI = {
  async getHeroSettings() {
    return await apiRequest<any>(API_ENDPOINTS.home.heroSettings);
  },
  
  async getHeroCards() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.home.heroCards);
    return response.results;
  },
  
  async getHowItWorks() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.home.howItWorks);
    return response.results;
  },
  
  async getNeighborhoods() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.home.neighborhoods);
    return response.results;
  },
  
  async getBenefits() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.home.benefits);
    return response.results;
  },
  
  async getBenefitGallery() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.home.benefitGallery);
    return response.results;
  },
  
  async getBenefitsSection() {
    return await apiRequest<any>(API_ENDPOINTS.home.benefitsSection);
  },
  
  async getContactSection() {
    return await apiRequest<any>(API_ENDPOINTS.home.contactSection);
  },
  
  async getInstagram() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.home.instagram);
    return response.results;
  },
  
  async getPersonSection() {
    return await apiRequest<any>(API_ENDPOINTS.home.personSection);
  },
  
  async getStats() {
    const response = await apiRequest<{ results: any[] }>(API_ENDPOINTS.home.stats);
    return response.results;
  },
};
