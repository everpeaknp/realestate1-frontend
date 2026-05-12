/**
 * Eagle property slug utilities.
 *
 * URLs use the format:  /properties/<readable-title-slug>--<eagle-id>
 * e.g.  /properties/premium-land-to-build-your-dream-home--1662814
 *
 * The Eagle ID is always recoverable from the suffix, so no backend lookup is needed.
 */

const SEPARATOR = '--';

/** Convert a free-form string into a URL-safe slug. */
function slugifyText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // strip non-alphanumeric (keep spaces and hyphens)
    .trim()
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-{2,}/g, '-');         // collapse multiple hyphens
}

/**
 * Build a human-readable slug for an Eagle property.
 * Falls back to just the ID if no title is available.
 */
export function buildEagleSlug(id: string, title?: string | null): string {
  const base = title ? slugifyText(title) : '';
  return base ? `${base}${SEPARATOR}${id}` : id;
}

/**
 * Extract the Eagle property ID from a slug.
 * Handles both the new format (`title--id`) and the legacy plain-ID format.
 */
export function extractEagleId(slug: string): string {
  const idx = slug.lastIndexOf(SEPARATOR);
  if (idx !== -1) {
    return slug.slice(idx + SEPARATOR.length);
  }
  // Legacy: slug is just the numeric ID
  return slug;
}
