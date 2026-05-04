/**
 * Eagle Single Property API Route
 * Server-side API endpoint for fetching a single property from Eagle API
 * 
 * GET /api/eagle/properties/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchPropertyById } from '@/lib/eagle-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
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
