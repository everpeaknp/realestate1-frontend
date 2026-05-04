/**
 * Eagle GraphQL API Integration
 * Secure server-side API layer for Eagle Real Estate API
 *
 * Field names are verified against the official Eagle schema at:
 * https://api.eaglesoftware.com.au/v3/property.doc.html
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EagleProperty {
  id: string;
  formattedAddress: string;
  latitude?: number;
  longitude?: number;
  /** PropertyTypeEnum value e.g. HOUSE, APARTMENT */
  propertyType?: string;
  /** PropertyStatusEnum value e.g. CURRENT, SOLD, LEASED */
  status?: string;
  price?: number;
  /** Human-readable advertised price string */
  advertisedPrice?: string;
  description?: string;
  headline?: string;
  /** Whether the property is featured */
  featured?: boolean;
  /** Land size as a string (may include units) */
  landSize?: string;
  landSizeUnits?: string;
  /** Square thumbnail URL (300x300) */
  thumbnailSquare?: string;
  images?: EagleImage[];
  floorplans?: EagleFloorPlan[];
  vendors?: EagleVendor[];
  agents?: EagleAgent[];
  inspections?: EagleInspectionConnection;
  createdAt?: string;
  updatedAt?: string;
}

export interface EagleImage {
  id: string;
  url: string;
}

export interface EagleFloorPlan {
  id: string;
  url: string;
}

export interface EagleVendor {
  contact?: {
    firstName?: string;
    lastName?: string;
  };
}

export interface EagleAgent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  title?: string;
  avatarUrl?: string;
}

export interface EagleInspection {
  id: string;
  /** ISO8601 start datetime */
  start?: string;
  /** ISO8601 finish datetime */
  finish?: string;
}

export interface EagleInspectionConnection {
  nodes: EagleInspection[];
}

export interface PropertiesResponse {
  properties: {
    nodes: EagleProperty[];
    pageInfo?: {
      hasNextPage: boolean;
      endCursor?: string;
    };
  };
}

export interface PropertyResponse {
  property: EagleProperty;
}

// ─── Token cache (in-memory, server-side only) ────────────────────────────────

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Get authentication token from Eagle API.
 * Caches the token for 24 hours (Eagle token validity period).
 */
async function getAuthToken(): Promise<string> {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 3_600_000) {
    return cachedToken;
  }

  const clientId = process.env.EAGLE_CLIENT_ID;
  const clientSecret = process.env.EAGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Eagle API credentials not configured. Set EAGLE_CLIENT_ID and EAGLE_CLIENT_SECRET in environment variables.'
    );
  }

  try {
    const credentials = `${clientId}:${clientSecret}`;
    console.log('[Eagle API] Attempting authentication...');

    const tokenUrl = process.env.EAGLE_TOKEN_URL ?? 'https://www.eagleagent.com.au/api/v3/token';

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[Eagle API] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Eagle API] Authentication failed:', errorText);
      throw new Error(`Eagle API authentication failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('[Eagle API] Response data keys:', Object.keys(data));

    const token =
      data?.data?.token?.token ||
      data?.token?.token ||
      data?.token ||
      data?.access_token;

    if (!token) {
      console.error('[Eagle API] No token in response:', JSON.stringify(data, null, 2));
      throw new Error(`No token received from Eagle API. Response: ${JSON.stringify(data)}`);
    }

    cachedToken = token;
    tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    console.log('[Eagle API] Authentication successful, token cached');
    return token;
  } catch (error) {
    console.error('[Eagle API] Authentication error:', error);
    throw error;
  }
}

// ─── GraphQL executor ─────────────────────────────────────────────────────────

async function executeGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const token = await getAuthToken();

  const graphqlUrl = process.env.EAGLE_GRAPHQL_URL ?? 'https://www.eagleagent.com.au/api/v3/graphql';

  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Eagle GraphQL request failed: ${response.status} ${errorText}`);
  }

  const result = await response.json();

  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  return result.data as T;
}

// ─── Shared field set for property lists ─────────────────────────────────────

const PROPERTY_LIST_FIELDS = `
  id
  formattedAddress
  latitude
  longitude
  propertyType
  status
  price
  advertisedPrice
  description
  headline
  featured
  landSize
  landSizeUnits
  thumbnailSquare
  images {
    id
    url
  }
  agents {
    id
    name
    email
    phone
    mobile
    title
    avatarUrl
  }
  inspections {
    nodes {
      id
      start
      finish
    }
  }
  createdAt
  updatedAt
`;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch properties from Eagle API.
 * Note: Eagle's `properties` field does not accept a `where` filter argument.
 * Status/type filtering is applied client-side on the returned array.
 */
export async function fetchProperties(options?: {
  limit?: number;
  status?: string;
  propertyType?: string;
}): Promise<EagleProperty[]> {
  const { limit = 50, status, propertyType } = options || {};

  const query = `
    query GetProperties($limit: Int) {
      properties(first: $limit) {
        nodes {
          ${PROPERTY_LIST_FIELDS}
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const data = await executeGraphQL<PropertiesResponse>(query, { limit });
  let nodes = data.properties.nodes || [];

  if (status) {
    nodes = nodes.filter((p) => p.status === status);
  }
  if (propertyType) {
    nodes = nodes.filter((p) => p.propertyType === propertyType);
  }

  return nodes;
}

/**
 * Fetch a single property by ID from Eagle API.
 */
export async function fetchPropertyById(id: string): Promise<EagleProperty | null> {
  const query = `
    query GetProperty($id: ID!) {
      property(id: $id) {
        id
        formattedAddress
        latitude
        longitude
        propertyType
        status
        price
        advertisedPrice
        description
        headline
        featured
        landSize
        landSizeUnits
        thumbnailSquare
        images {
          id
          url
        }
        floorplans {
          id
          url
        }
        vendors {
          contact {
            firstName
            lastName
          }
        }
        agents {
          id
          name
          email
          phone
          mobile
          title
          avatarUrl
        }
        inspections {
          nodes {
            id
            start
            finish
          }
        }
        createdAt
        updatedAt
      }
    }
  `;

  const data = await executeGraphQL<PropertyResponse>(query, { id });
  return data.property || null;
}

/**
 * Search properties by address — fetches a broader set and filters client-side
 * since Eagle's `properties` field does not support a search argument.
 */
export async function searchProperties(
  searchTerm: string,
  limit = 20
): Promise<EagleProperty[]> {
  const all = await fetchProperties({ limit: Math.max(limit * 5, 100) });
  const lower = searchTerm.toLowerCase();
  return all
    .filter((p) => p.formattedAddress?.toLowerCase().includes(lower))
    .slice(0, limit);
}

/**
 * Fetch featured/active properties.
 * Uses ACTIVE status per the Eagle PropertyStatusEnum.
 */
export async function fetchFeaturedProperties(limit = 8): Promise<EagleProperty[]> {
  return fetchProperties({ limit, status: 'ACTIVE' });
}

/**
 * Clear cached token (useful for testing or forced refresh).
 */
export function clearTokenCache(): void {
  cachedToken = null;
  tokenExpiry = null;
}
