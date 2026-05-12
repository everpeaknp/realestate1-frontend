/**
 * Eagle Single Property API Route
 * Server-side API endpoint for fetching a single property from Eagle API
 * 
 * GET /api/eagle/properties/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchPropertyById } from '@/lib/eagle-api';

function getBackendBaseUrl() {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
}

function getPropertyFeedSource() {
  return (process.env.PROPERTY_FEED_SOURCE || 'EAGLE_API').toUpperCase();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyFeedSource = getPropertyFeedSource();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    if (propertyFeedSource === 'REAXML') {
      const backendUrl = `${getBackendBaseUrl()}/api/reaxml/properties/${id}/`;
      const response = await fetch(backendUrl, { cache: 'no-store' });
      const payload = await response.json();
      return NextResponse.json(payload, { status: response.status });
    }

    const property = await fetchPropertyById(id);

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      property,
      source: propertyFeedSource,
    });
  } catch (error) {
    console.error('Eagle API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch property',
      },
      { status: 500 }
    );
  }
}

// Enable caching for 5 minutes
export const revalidate = 300;
