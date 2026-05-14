'use client';

import { motion } from 'framer-motion';
import { School, Trees as Park, ShoppingCart, Train, MapPin, Building2 } from 'lucide-react';
import { Map, MapMarker, MarkerContent, MapControls } from '@/components/ui/map';
import { EagleProperty } from '@/lib/eagle-api';

interface LocationSectionProps {
  property: EagleProperty;
}

// Icon map for keyword matching
const POI_ICONS = [
  { keywords: ['school', 'college', 'university', 'education'], icon: School },
  { keywords: ['park', 'reserve', 'garden', 'oval', 'green'], icon: Park },
  { keywords: ['shop', 'mall', 'centre', 'center', 'market', 'village', 'plaza'], icon: ShoppingCart },
  { keywords: ['station', 'train', 'bus', 'transport', 'metro'], icon: Train },
  { keywords: ['hospital', 'medical', 'clinic', 'health'], icon: Building2 },
];

function getIcon(name: string) {
  const lower = name.toLowerCase();
  for (const { keywords, icon } of POI_ICONS) {
    if (keywords.some((k) => lower.includes(k))) return icon;
  }
  return MapPin;
}

/** Parse nearby POIs from the description text.
 *  Looks for patterns like "500m to X", "2km from Y", "walk to Z", "close to W" */
function parseNearbyFromDescription(description: string): { name: string; dist: string }[] {
  const results: { name: string; dist: string }[] = [];

  // Pattern: "Xm/km to/from <name>" or "<name> X min walk"
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:m|km|min(?:ute)?s?)\s+(?:to|from|walk(?:ing)?\s+to)\s+([A-Z][^,.!?\n]{3,40})/gi,
    /(?:close to|near|next to|opposite|walking distance to)\s+([A-Z][^,.!?\n]{3,40})/gi,
    /([A-Z][^,.!?\n]{3,40})\s+(?:is\s+)?(?:just\s+)?(\d+(?:\.\d+)?)\s*(?:m|km|min(?:ute)?s?)\s+away/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(description)) !== null && results.length < 4) {
      if (pattern.source.startsWith('(\\d')) {
        // "Xm to Name" pattern
        results.push({ dist: `${match[1]} away`, name: match[2].trim() });
      } else if (pattern.source.startsWith('(?:close')) {
        // "close to Name" pattern
        results.push({ dist: 'Nearby', name: match[1].trim() });
      } else {
        // "Name is X away" pattern
        results.push({ dist: `${match[2]} away`, name: match[1].trim() });
      }
    }
  }

  return results;
}

/** Extract highlight pills from description — things like "5 min to station", "school zone" */
function parsePills(description: string): string[] {
  const pills: string[] = [];
  const text = description.toLowerCase();

  if (/\d+\s*min(?:ute)?s?\s+(?:to|from)\s+(?:train|station|bus|transport)/.test(text)) {
    const m = text.match(/(\d+)\s*min(?:ute)?s?\s+(?:to|from)\s+(?:train|station|bus|transport)/);
    if (m) pills.push(`${m[1]} MIN TO STATION`);
  }
  if (/school\s+zone|zoned\s+for|catchment/.test(text)) {
    pills.push('SCHOOL ZONE');
  }
  if (/\d+\s*min(?:ute)?s?\s+(?:to|from)\s+(?:cbd|city|town centre)/.test(text)) {
    const m = text.match(/(\d+)\s*min(?:ute)?s?\s+(?:to|from)\s+(?:cbd|city|town centre)/);
    if (m) pills.push(`${m[1]} MIN TO CBD`);
  }
  if (/corner\s+block|corner\s+lot/.test(text)) pills.push('CORNER BLOCK');
  if (/dual\s+occupancy|granny\s+flat/.test(text)) pills.push('DUAL OCCUPANCY');

  return pills.slice(0, 3);
}

export default function LocationSection({ property }: LocationSectionProps) {
  const addressParts = property.formattedAddress?.split(',');
  const suburbLine =
    addressParts && addressParts.length > 1
      ? addressParts.slice(1).join(',').trim()
      : property.formattedAddress;
  const locationLabel = suburbLine || property.formattedAddress || 'Location';
  const hasCoordinates =
    typeof property.longitude === 'number' && typeof property.latitude === 'number';
  const lng = hasCoordinates ? property.longitude : undefined;
  const lat = hasCoordinates ? property.latitude : undefined;

  // Parse dynamic data from description
  const description = property.description ?? '';
  const nearbyItems = parseNearbyFromDescription(description);
  const pills = parsePills(description);

  // Fallback nearby items if description has no parseable POIs
  const fallbackNearby = [
    { name: `${locationLabel} Schools`, dist: 'Nearby' },
    { name: `${locationLabel} Parks`, dist: 'Nearby' },
    { name: `${locationLabel} Shops`, dist: 'Nearby' },
  ];

  const displayNearby = nearbyItems.length > 0 ? nearbyItems : fallbackNearby;

  return (
    <section className="py-32 overflow-hidden" style={{ backgroundColor: '#FAF9F9' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header row */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-serif mb-4">Location & Lifestyle</h3>
            <p className="text-neutral-500 text-lg">
              {locationLabel} — everything at your doorstep.
            </p>
          </motion.div>

          {/* Pills — only render if we found any from the description */}
          {pills.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="bg-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-800 shadow-sm border border-neutral-100"
                >
                  {pill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative h-[500px] md:h-[600px] w-full rounded-2xl overflow-hidden shadow-xl"
        >
          {hasCoordinates && lng !== undefined && lat !== undefined ? (
            <Map
              center={[lng, lat]}
              zoom={14}
              styles={{
                light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
                dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
              }}
            >
              <MapMarker longitude={lng} latitude={lat}>
                <MarkerContent>
                  <div className="flex flex-col items-center">
                    <div className="bg-secondary text-white rounded-full p-2 shadow-lg">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="w-0.5 h-3 bg-secondary" />
                    <div className="w-2 h-2 rounded-full bg-secondary/40" />
                  </div>
                </MarkerContent>
              </MapMarker>

              <MapControls position="bottom-right" showZoom showFullscreen />
            </Map>
          ) : (
            <div className="relative h-full w-full overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(120deg, #e7e3dc 0%, #d9d7d2 45%, #d2d8c8 100%)',
                }}
              />
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(18deg, rgba(255,255,255,0.5) 0 2px, transparent 2px 26px), repeating-linear-gradient(108deg, rgba(255,255,255,0.45) 0 2px, transparent 2px 30px)',
                }}
              />
              <div className="absolute inset-0 backdrop-blur-[3px] bg-white/20" />
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <span className="rounded-full bg-[#3f3b46] text-white px-5 md:px-7 py-2.5 md:py-3 text-base md:text-xl font-medium shadow-2xl">
                  Contact agent for address
                </span>
              </div>
            </div>
          )}

          {/* Nearby card overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="absolute bottom-8 left-6 md:left-8 bg-white/90 backdrop-blur-[12px] [-webkit-backdrop-filter:blur(12px)] p-8 md:p-10 rounded-2xl max-w-sm shadow-2xl border border-white/50 z-10"
          >
            <h5 className="text-2xl font-serif mb-8 text-neutral-900 border-b border-neutral-100 pb-4 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-secondary" />
              {locationLabel}
            </h5>

            <ul className="space-y-8">
              {displayNearby.map((item, i) => {
                const Icon = getIcon(item.name);
                return (
                  <li key={i} className="flex items-center gap-5 group">
                    <div className="p-3 bg-neutral-100 rounded-lg group-hover:bg-secondary group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-800 text-base">{item.name}</p>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">
                        {item.dist}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
