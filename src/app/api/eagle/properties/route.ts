/**
 * Eagle Properties API Route
 * Server-side API endpoint for fetching properties from Eagle API
 * 
 * GET /api/eagle/properties
 * Query params:
 *   - limit: number of properties to fetch (default: 50)
 *   - status: filter by status (e.g., 'CURRENT')
 *   - propertyType: filter by type (e.g., 'HOUSE', 'APARTMENT')
 *   - search: search term for address/location
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchProperties, searchProperties } from '@/lib/eagle-api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const status = searchParams.get('status') || undefined;
    const propertyType = searchParams.get('propertyType') || undefined;
    const search = searchParams.get('search') || undefined;

    let properties;

    if (search) {
      properties = await searchProperties(search, limit);
    } else {
      properties = await fetchProperties({
        limit,
        status,
        propertyType,
      });
    }

    return NextResponse.json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error('Eagle API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch properties',
      },
      { status: 500 }
    );
  }
}

// Enable caching for 5 minutes
export const revalidate = 300;
