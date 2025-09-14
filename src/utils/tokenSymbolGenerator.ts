/**
 * Token Symbol Generator Utility
 * 
 * Generates blockchain token symbols from collection names
 * using the first 3 consonants approach for consistent branding.
 */

/**
 * Extracts first 3 consonants from a string for branding consistency
 */
function extractConsonants(text: string): string {
  const consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
  const vowels = 'aeiouAEIOU';
  
  // Get consonants first
  const foundConsonants = text
    .split('')
    .filter(char => consonants.includes(char))
    .slice(0, 3);
  
  // If less than 3 consonants, supplement with vowels
  if (foundConsonants.length < 3) {
    const foundVowels = text
      .split('')
      .filter(char => vowels.includes(char))
      .slice(0, 3 - foundConsonants.length);
    
    foundConsonants.push(...foundVowels);
  }
  
  // If still less than 3, use remaining alphanumeric chars
  if (foundConsonants.length < 3) {
    const remaining = text
      .replace(/[^a-zA-Z0-9]/g, '')
      .split('')
      .filter(char => !foundConsonants.includes(char))
      .slice(0, 3 - foundConsonants.length);
    
    foundConsonants.push(...remaining);
  }
  
  return foundConsonants.join('').toLowerCase();
}


/**
 * Generates blockchain token symbol from collection name
 */
export function generateTokenSymbol(collectionName: string): string {
  // Input validation
  if (!collectionName || typeof collectionName !== 'string') {
    return 'UNT';
  }
  
  const consonantCode = extractConsonants(collectionName);
  
  // Handle edge cases
  const finalConsonantCode = consonantCode || collectionName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3) || 'COL';
  
  return finalConsonantCode.toUpperCase();
}

/**
 * Validates if a token symbol is URL and blockchain safe
 */
export function isValidTokenSymbol(symbol: string): boolean {
  return /^[A-Z0-9]{1,11}$/.test(symbol); // Standard token symbol format
}

