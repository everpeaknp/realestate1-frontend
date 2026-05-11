/**
 * Test endpoint to verify Bijen Khadka filter is working
 * GET /api/eagle/test-filter
 */

import { NextResponse } from 'next/server';
import { fetchProperties } from '@/lib/eagle-api';

export async function GET() {
  try {
    console.log('\n=== TESTING BIJEN KHADKA FILTER ===\n');
    
    // Test 1: Fetch with Bijen filter
    console.log('Test 1: Fetching properties with agentName="Bijen"...');
    const bijenProperties = await fetchProperties({ 
      limit: 50,
      agentName: 'Bijen'
    });
    
    console.log(`✓ Found ${bijenProperties.length} properties for Bijen`);
    
    // Test 2: Fetch all properties (no filter)
    console.log('\nTest 2: Fetching all properties (no filter)...');
    const allProperties = await fetchProperties({ limit: 50 });
    
    console.log(`✓ Found ${allProperties.length} total properties`);
    
    // Extract unique agents from both sets
    const bijenAgents = new Set<string>();
    bijenProperties.forEach(p => {
      p.agents?.forEach(a => {
        if (a.name) bijenAgents.add(a.name);
      });
    });
    
    const allAgents = new Set<string>();
    allProperties.forEach(p => {
      p.agents?.forEach(a => {
        if (a.name) allAgents.add(a.name);
      });
    });
    
    console.log('\n=== RESULTS ===');
    console.log(`Bijen properties: ${bijenProperties.length}`);
    console.log(`Agents in Bijen results: ${Array.from(bijenAgents).join(', ')}`);
    console.log(`\nAll properties: ${allProperties.length}`);
    console.log(`All agents: ${Array.from(allAgents).join(', ')}`);
    
    // Sample Bijen properties
    const sampleBijen = bijenProperties.slice(0, 3).map(p => ({
      address: p.formattedAddress,
      agents: p.agents?.map(a => ({
        name: a.name,
        email: a.email,
        phone: a.phone || a.mobile
      }))
    }));
    
    return NextResponse.json({
      success: true,
      summary: {
        bijenPropertiesCount: bijenProperties.length,
        allPropertiesCount: allProperties.length,
        bijenAgents: Array.from(bijenAgents),
        allAgents: Array.from(allAgents),
        filterWorking: bijenProperties.length < allProperties.length && bijenAgents.size === 1
      },
      sampleBijenProperties: sampleBijen,
      message: bijenProperties.length > 0 
        ? `✓ Filter is working! Found ${bijenProperties.length} properties for Bijen Khadka`
        : '✗ No properties found for Bijen Khadka - check agent name/email/phone in Eagle API'
    });
  } catch (error) {
    console.error('Test filter error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Test failed',
      },
      { status: 500 }
    );
  }
}
