/**
 * Reusable Zod Validation Schemas
 * Centralized validation logic for all forms
 */

import { z } from 'zod';

// ============================================================================
// REGEX PATTERNS
// ============================================================================

// Phone: 7-15 digits, optional +, spaces, dashes, parentheses
const PHONE_REGEX = /^[\d\s\-\+\(\)]{7,20}$/;

// Name: Letters, spaces, hyphens, apostrophes only (prevents script injection)
const NAME_REGEX = /^[a-zA-Z\s\-']+$/;

// No dangerous characters or HTML tags
const NO_HTML_REGEX = /^[^<>]*$/;

// ============================================================================
// REUSABLE FIELD SCHEMAS
// ============================================================================

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email is too long')
  .trim()
  .toLowerCase();

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long')
  .regex(NAME_REGEX, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .regex(NO_HTML_REGEX, 'Invalid characters detected')
  .trim()
  .transform((val) => val.replace(/\s+/g, ' ')); // Normalize spaces

export const phoneSchema = z
  .string()
  .min(7, 'Phone number must be at least 7 digits')
  .max(20, 'Phone number is too long')
  .regex(PHONE_REGEX, 'Please enter a valid phone number')
  .trim();

export const messageSchema = z
  .string()
  .min(10, 'Message must be at least 10 characters')
  .max(2000, 'Message is too long')
  .regex(NO_HTML_REGEX, 'Invalid characters detected')
  .trim();

export const subjectSchema = z
  .string()
  .min(3, 'Subject must be at least 3 characters')
  .max(200, 'Subject is too long')
  .regex(NO_HTML_REGEX, 'Invalid characters detected')
  .trim()
  .optional()
  .or(z.literal(''));

export const locationSchema = z
  .string()
  .min(2, 'Location must be at least 2 characters')
  .max(200, 'Location is too long')
  .regex(NO_HTML_REGEX, 'Invalid characters detected')
  .trim()
  .optional()
  .or(z.literal(''));

export const budgetSchema = z
  .string()
  .max(100, 'Budget is too long')
  .regex(/^[\d\s\$\,\-\.]+$/, 'Budget can only contain numbers, $, commas, and hyphens')
  .trim()
  .optional()
  .or(z.literal(''));

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .max(500, 'URL is too long')
  .trim()
  .optional()
  .or(z.literal(''));

// ============================================================================
// FORM SCHEMAS
// ============================================================================

/**
 * Newsletter Form Schema
 */
export const newsletterSchema = z.object({
  email: emailSchema,
  // Honeypot field - should remain empty
  website: z.string().max(0, 'Invalid submission').optional(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

/**
 * Comment Form Schema
 */
export const commentSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  website: urlSchema,
  comment: messageSchema,
  // Honeypot field
  phone: z.string().max(0, 'Invalid submission').optional(),
});

export type CommentFormData = z.infer<typeof commentSchema>;

/**
 * Contact Form Schema
 */
export const contactSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema.optional().or(z.literal('')),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  inquiry_type: z.enum(['buying', 'selling', 'renting', 'home-loan', 'general']),
  location: locationSchema,
  subject: subjectSchema,
  message: messageSchema,
  // Honeypot field
  fax: z.string().max(0, 'Invalid submission').optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Home Worth / Valuation Form Schema
 */
export const homeWorthSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(300, 'Address is too long')
    .regex(NO_HTML_REGEX, 'Invalid characters detected')
    .trim(),
  propertyType: z.enum(['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial']),
  budget: budgetSchema,
  message: z
    .string()
    .max(1000, 'Message is too long')
    .regex(NO_HTML_REGEX, 'Invalid characters detected')
    .trim()
    .optional()
    .or(z.literal('')),
  // Honeypot field
  company: z.string().max(0, 'Invalid submission').optional(),
});

export type HomeWorthFormData = z.infer<typeof homeWorthSchema>;

/**
 * Property Inquiry Form Schema (Sidebar)
 */
export const propertyInquirySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  message: messageSchema,
  // Honeypot field
  address: z.string().max(0, 'Invalid submission').optional(),
});

export type PropertyInquiryFormData = z.infer<typeof propertyInquirySchema>;
