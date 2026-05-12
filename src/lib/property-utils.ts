import { EagleProperty } from './eagle-api';

export interface PropertyStats {
  beds: number | null;
  baths: number | null;
  cars: number | null;
}

/**
 * Parse bed/bath/car counts from Eagle property data.
 *
 * Eagle descriptions contain Unicode artifacts (â¢ = •, emoji bytes, etc.)
 * We strip non-ASCII first, then try multiple patterns in priority order.
 */
export function parsePropertyStats(property: EagleProperty): PropertyStats {
  const explicitBeds = typeof property.beds === 'number' && !Number.isNaN(property.beds) ? property.beds : null;
  const explicitBaths = typeof property.baths === 'number' && !Number.isNaN(property.baths) ? property.baths : null;
  const explicitCars = typeof property.cars === 'number' && !Number.isNaN(property.cars) ? property.cars : null;

  if (explicitBeds !== null || explicitBaths !== null || explicitCars !== null) {
    return {
      beds: explicitBeds,
      baths: explicitBaths,
      cars: explicitCars,
    };
  }

  const raw = `${property.headline ?? ''} ${property.description ?? ''}`;

  // Strip non-ASCII bytes (emoji, Unicode bullets â¢, â, etc.) and collapse whitespace
  const text = raw.replace(/[^\x00-\x7F]/g, ' ').replace(/\s+/g, ' ');

  // ── Beds ──────────────────────────────────────────────────────────────────
  // Try: "4 Bedrooms", "4 Spacious Bedrooms", "4 Large Master Bedrooms"
  // Allow 0–3 adjective words between the number and "bed"
  const bedsMatch =
    text.match(/(\d+)\s+(?:\w+\s+){0,3}bed(?:room)?s?\b/i) ??
    text.match(/(\d+)\s*bed(?:room)?s?\b/i);

  // ── Baths ─────────────────────────────────────────────────────────────────
  const bathsMatch =
    text.match(/(\d+)\s+(?:\w+\s+){0,3}bath(?:room)?s?\b/i) ??
    text.match(/(\d+)\s*bath(?:room)?s?\b/i);

  // ── Cars ──────────────────────────────────────────────────────────────────
  let cars: number | null = null;

  // Numeric: "2 Car Spaces", "2 Car Garage", "2 Garage Spaces"
  const carsNumMatch =
    text.match(/(\d+)\s+(?:car\s+)?(?:space|garage|park)s?\b/i) ??
    text.match(/(\d+)\s*car\s*space?s?\b/i);

  if (carsNumMatch) {
    cars = parseInt(carsNumMatch[1]);
  } else if (/triple\s+(?:car\s+)?garage/i.test(text)) {
    cars = 3;
  } else if (/double\s+(?:car\s+)?garage/i.test(text)) {
    cars = 2;
  } else if (/single\s+(?:car\s+)?garage/i.test(text)) {
    cars = 1;
  }

  return {
    beds: bedsMatch ? parseInt(bedsMatch[1]) : null,
    baths: bathsMatch ? parseInt(bathsMatch[1]) : null,
    cars,
  };
}
