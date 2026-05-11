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
 *   - agentName: filter by agent name (optional, defaults to 'Bijen')
 *   - showAllAgents: set to 'true' to disable agent filtering (for debugging)
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
    const showAllAgents = searchParams.get('showAllAgents') !== 'false';
    // Show all agents by default since Bijen Khadka is not in Eagle API
    // Available agents: Sheetal Bhattarai, Sanjib Parajuli, Naren Rai, Zon Shrestha, Saurav Tripathee
    const agentName = searchParams.get('agentName') || undefined;

    let properties;

    // Only use searchProperties if search term is non-empty
    if (search && search.trim() !== '') {
      properties = await searchProperties(search, limit);
    } else {
      properties = await fetchProperties({
        limit,
        status,
        propertyType,
        agentName: showAllAgents ? undefined : agentName,
      });
    }

    // Log filtering results
    console.log('[Eagle API] Properties fetched:', properties.length);
    console.log('[Eagle API] Filter settings:', { 
      agentName: showAllAgents ? 'DISABLED' : agentName,
      showAllAgents,
      search: search || 'none'
    });
    
    if (properties.length > 0) {
      // Log all unique agent names in results
      const uniqueAgents = new Set<string>();
      properties.forEach(p => {
        p.agents?.forEach(a => {
          if (a.name) uniqueAgents.add(a.name);
        });
      });
      console.log('[Eagle API] Unique agents in results:', Array.from(uniqueAgents));
      
      // Log sample properties
      console.log('[Eagle API] Sample properties:', 
        properties.slice(0, 3).map(p => ({
          address: p.formattedAddress,
          agents: p.agents?.map(a => ({ name: a.name, email: a.email })) || []
        }))
      );
    }

    // Additional filter for search results
    if (search && search.trim() !== '' && !showAllAgents) {
      const beforeFilter = properties.length;
      properties = properties.filter((p) =>
        p.agents?.some((agent) => {
          const agentNameLower = agent.name?.toLowerCase() || '';
          const agentEmail = agent.email?.toLowerCase() || '';
          const agentPhone = agent.phone || agent.mobile || '';
          
          return agentNameLower.includes('bijen') || 
                 agentNameLower.includes('khadka') ||
                 agentEmail.includes('bijen@lilywhiterealestate.com.au') ||
                 agentPhone.includes('600414701721');
        })
      );
      console.log(`[Eagle API] Search filter: ${beforeFilter} -> ${properties.length} properties`);
    }

    return NextResponse.json({
      success: true,
      count: properties.length,
      properties,
      debug: {
        filterEnabled: !showAllAgents,
        filteringBy: showAllAgents ? 'NONE (showing all agents)' : `Agent: ${agentName}`,
        searchTerm: search || 'none',
      }
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
