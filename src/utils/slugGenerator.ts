/**
 * Slug Generator Utility
 * 
 * Generates clean URL-safe slugs from collection names.
 * Simple approach: replace spaces with dashes, clean special characters.
 */

/**
 * Generates a clean URL slug from collection name
 */
export function generateSlug(collectionName: string): string {
  if (!collectionName || typeof collectionName !== 'string') {
    return 'untitled';
  }

  return collectionName
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, '')  // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-')             // Replace spaces with hyphens
    .replace(/-+/g, '-')              // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');         // Remove leading/trailing hyphens
}

/**
 * Generates a unique slug with timestamp suffix to prevent duplicates
 */
export function generateUniqueSlug(collectionName: string): string {
  const baseSlug = generateSlug(collectionName);
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits for brevity
  return baseSlug ? `${baseSlug}-${timestamp}` : `untitled-${timestamp}`;
}

/**
 * Generates a unique slug using draft ID from Vibe.Market system
 */
export function generateUniqueSlugFromDraft(collectionName: string, draftId: string): string {
  const baseSlug = generateSlug(collectionName);
  // Extract unique part from draft_1757399545739_c5pxfwt42 → c5pxfwt42
  const uniquePart = draftId.split('_').pop() || Date.now().toString().slice(-6);
  return baseSlug ? `${baseSlug}-${uniquePart}` : `untitled-${uniquePart}`;
}

/**
 * Validates if a slug is URL safe
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && !slug.startsWith('-') && !slug.endsWith('-');
}