/**
 * Client-side Rate Limiting
 * Prevents spam submissions and abuse
 */

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly blockDurationMs: number;

  constructor(
    maxAttempts: number = 3,
    windowMs: number = 60000, // 1 minute
    blockDurationMs: number = 300000 // 5 minutes
  ) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
  }

  /**
   * Check if an action is allowed
   * @param key - Unique identifier (e.g., form name + email)
   * @returns true if allowed, false if rate limited
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry) {
      // First attempt
      this.storage.set(key, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
      return true;
    }

    // Check if block period has expired
    if (now - entry.lastAttempt > this.blockDurationMs) {
      // Reset after block period
      this.storage.set(key, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
      return true;
    }

    // Check if window has expired
    if (now - entry.firstAttempt > this.windowMs) {
      // Reset window
      this.storage.set(key, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
      return true;
    }

    // Within window - check count
    if (entry.count >= this.maxAttempts) {
      return false;
    }

    // Increment count
    entry.count++;
    entry.lastAttempt = now;
    this.storage.set(key, entry);
    return true;
  }

  /**
   * Get remaining time until rate limit expires
   * @param key - Unique identifier
   * @returns milliseconds until unblocked, or 0 if not blocked
   */
  getTimeUntilReset(key: string): number {
    const entry = this.storage.get(key);
    if (!entry || entry.count < this.maxAttempts) {
      return 0;
    }

    const now = Date.now();
    const timeSinceLastAttempt = now - entry.lastAttempt;
    const remaining = this.blockDurationMs - timeSinceLastAttempt;

    return Math.max(0, remaining);
  }

  /**
   * Clear rate limit for a key
   */
  clear(key: string): void {
    this.storage.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.storage.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Hook for rate limiting in forms
 */
export function useRateLimit(formName: string, identifier: string = '') {
  const key = `${formName}:${identifier || 'anonymous'}`;

  const isAllowed = () => rateLimiter.isAllowed(key);
  const getTimeUntilReset = () => rateLimiter.getTimeUntilReset(key);
  const clear = () => rateLimiter.clear(key);

  return {
    isAllowed,
    getTimeUntilReset,
    clear,
  };
}

/**
 * Format milliseconds to human-readable time
 */
export function formatTimeRemaining(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}
