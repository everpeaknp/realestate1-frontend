/**
 * Input Sanitization Utilities
 * Prevents XSS, SQL Injection, and other security vulnerabilities
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content - removes all dangerous tags and attributes
 * Use this for any user input that might contain HTML
 */
export function sanitizeHTML(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side: basic sanitization
    return dirty
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim();
  }

  // Client-side: use DOMPurify
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Remove ALL HTML tags
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitize plain text input
 * Removes dangerous characters and normalizes whitespace
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers (onclick, onerror, etc.)
    .trim()
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[<>'"]/g, ''); // Remove dangerous characters
}

/**
 * Sanitize phone number - keep only digits, spaces, +, -, (, )
 */
export function sanitizePhone(phone: string): string {
  return phone
    .trim()
    .replace(/[^\d\s\+\-\(\)]/g, ''); // Keep only valid phone characters
}

/**
 * Sanitize URL
 */
export function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize all form data before submission
 * This is the main function to use before sending data to the backend
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized: Record<string, any> = { ...data };

  Object.keys(sanitized).forEach((key) => {
    const value = sanitized[key];

    if (typeof value === 'string') {
      // Apply appropriate sanitization based on field name
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('phone')) {
        sanitized[key] = sanitizePhone(value);
      } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('website')) {
        sanitized[key] = sanitizeURL(value);
      } else {
        sanitized[key] = sanitizeText(value);
      }
    }
  });

  return sanitized as T;
}

/**
 * Check if input contains potential XSS patterns
 * Returns true if suspicious content is detected
 */
export function containsXSS(input: string): boolean {
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Check if input contains potential SQL injection patterns
 * Returns true if suspicious content is detected
 */
export function containsSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|;|\/\*|\*\/)/,
    /(\bOR\b.*=.*)/i,
    /(\bAND\b.*=.*)/i,
    /('|")\s*(OR|AND)\s*('|")/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Validate that sanitized data is safe
 * Throws error if dangerous patterns are detected
 */
export function validateSanitizedData(data: Record<string, any>): void {
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      if (containsXSS(value)) {
        throw new Error(`Potential XSS detected in field: ${key}`);
      }
      if (containsSQLInjection(value)) {
        throw new Error(`Potential SQL injection detected in field: ${key}`);
      }
    }
  });
}
