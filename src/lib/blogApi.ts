/**
 * Blog API Utility Functions
 * Centralized API calls for blog functionality
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface BlogGalleryImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  featured_image: string | null;
  author_name: string;
  author_avatar: string | null;
  category: string;
  tags: string[];
  views: number;
  comments_count: number;
  published_at: string;
  updated_at?: string;
  comments?: Comment[];
  gallery_images?: BlogGalleryImage[];
}

export interface Comment {
  id: number;
  post: number;
  author_name: string;
  author_email: string;
  author_avatar: string | null;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'SPAM';
  created_at: string;
}

export interface CommentSubmission {
  post: number;
  author_name: string;
  author_email: string;
  content: string;
}

/**
 * Fetch all blog posts
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const endpoint = `${API_URL}/api/blog/posts/`;
  
  console.log('🔍 Fetching blog posts from:', endpoint);
  
  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      cache: 'no-store', // Disable caching for debugging
    });

    console.log('📡 Response status:', response.status, response.statusText);
    console.log('📡 Response headers:', {
      'content-type': response.headers.get('content-type'),
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
    });

    if (!response.ok) {
      console.error(`❌ Blog API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Received data:', data);
    
    // Handle Django REST Framework pagination format
    let posts: BlogPost[];
    
    if (Array.isArray(data)) {
      // Direct array response (no pagination)
      posts = data;
      console.log('📦 Data type: array (no pagination)');
    } else if (data && typeof data === 'object' && 'results' in data) {
      // Paginated response from DRF
      posts = data.results;
      console.log('📦 Data type: paginated response');
      console.log('📊 Pagination info:', {
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } else {
      // Unexpected format
      console.error('❌ Blog API returned unexpected format:', data);
      console.error('💡 Tip: Check if Django backend is running at:', API_URL);
      console.error('💡 Tip: Test the API directly in browser:', endpoint);
      return [];
    }
    
    // Ensure posts is an array
    if (!Array.isArray(posts)) {
      console.error('❌ Posts is not an array:', posts);
      return [];
    }

    console.log(`✅ Successfully fetched ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    console.error('💡 Possible causes:');
    console.error('   1. Django backend is not running');
    console.error('   2. CORS is not configured');
    console.error('   3. Wrong API URL:', API_URL);
    console.error('💡 Try: http://localhost:3000/api-test to diagnose');
    // Return empty array instead of throwing to prevent page crash
    return [];
  }
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost> {
  const endpoint = `${API_URL}/api/blog/posts/${slug}/`;
  
  console.log('🔍 Fetching single blog post from:', endpoint);
  console.log('🔍 Slug:', slug);
  console.log('🔍 Environment:', typeof window === 'undefined' ? 'SERVER' : 'CLIENT');
  
  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 60 },
      cache: 'no-store', // Disable caching for debugging
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('📡 Single post response status:', response.status, response.statusText);
    console.log('📡 Single post response headers:', {
      'content-type': response.headers.get('content-type'),
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
    });

    if (!response.ok) {
      // Try to get error details
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (e) {
        errorBody = 'Could not read error response';
      }
      
      if (response.status === 404) {
        console.error('❌ Blog post not found (404)');
        console.error('💡 Endpoint:', endpoint);
        console.error('💡 Slug:', slug);
        console.error('💡 Response body:', errorBody);
        throw new Error('Blog post not found');
      }
      console.error(`❌ Blog API error: ${response.status} ${response.statusText}`);
      console.error('💡 Response body:', errorBody);
      throw new Error(`Failed to fetch blog post: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched blog post:', data.title);
    console.log('📦 Post data:', {
      id: data.id,
      slug: data.slug,
      title: data.title,
      comments_count: data.comments_count,
    });
    
    return data;
  } catch (error) {
    console.error(`❌ Error fetching blog post ${slug}:`, error);
    console.error('💡 Full endpoint:', endpoint);
    console.error('💡 Error type:', error instanceof Error ? error.constructor.name : typeof error);
    if (error instanceof Error) {
      console.error('💡 Error message:', error.message);
    }
    throw error;
  }
}

/**
 * Fetch all blog categories
 */
export async function getBlogCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/api/blog/posts/categories/`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Submit a comment to a blog post
 */
export async function submitComment(comment: CommentSubmission): Promise<{ message: string; data: Comment }> {
  try {
    const response = await fetch(`${API_URL}/api/blog/comments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit comment');
    }

    return response.json();
  } catch (error) {
    console.error('Error submitting comment:', error);
    throw error;
  }
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get related posts (simple implementation - same category)
 * In production, you might want a dedicated API endpoint
 */
export async function getRelatedPosts(currentSlug: string, category: string, limit: number = 4): Promise<BlogPost[]> {
  try {
    const allPosts = await getBlogPosts();
    
    // Filter by category and exclude current post
    const related = allPosts
      .filter(post => post.category === category && post.slug !== currentSlug)
      .slice(0, limit);
    
    return related;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}
