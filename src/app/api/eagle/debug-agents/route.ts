/**
 * Debug endpoint to see all agents in the Eagle API
 * GET /api/eagle/debug-agents
 */

import { NextResponse } from 'next/server';
import { fetchProperties } from '@/lib/eagle-api';

export async function GET() {
  try {
    // Fetch properties without any agent filter
    const properties = await fetchProperties({ limit: 100 });

    // Extract unique agents
    const agentsMap = new Map<string, { name: string; count: number; email?: string }>();

    properties.forEach((property) => {
      property.agents?.forEach((agent) => {
        if (agent.name) {
          const existing = agentsMap.get(agent.name);
          if (existing) {
            existing.count++;
          } else {
            agentsMap.set(agent.name, {
              name: agent.name,
              count: 1,
              email: agent.email,
            });
          }
        }
      });
    });

    const agents = Array.from(agentsMap.values()).sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      totalProperties: properties.length,
      totalAgents: agents.length,
      agents,
    });
  } catch (error) {
    console.error('Eagle API debug error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch agents',
      },
      { status: 500 }
    );
  }
}
