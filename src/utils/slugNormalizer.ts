/**
 * Normalizes a slug string according to URL-friendly slug rules
 * @param input - The raw input string to normalize
 * @param maxLength - Maximum length (default: 120)
 * @returns Normalized slug string
 */
export function normalizeSlug(input: string, maxLength: number = 120): string {
  if (!input) return ''

  let normalized = input

  // 1. URL Detection - Extract pathname from URLs
  normalized = extractPathFromUrl(normalized)

  // 2. Backslash conversion
  normalized = normalized.replace(/\\/g, '/')

  // 3. Lowercase everything
  normalized = normalized.toLowerCase()

  // Detect if input has trailing whitespace (before conversion)
  // This helps preserve trailing hyphens that come from trailing spaces
  const hasTrailingWhitespace = /[\s_]+$/.test(normalized)
  
  // Detect if user manually typed a hyphen at the start or end
  // (not from whitespace conversion)
  const hasLeadingHyphen = normalized.startsWith('-') && !/^[\s_]+/.test(input)
  const hasTrailingHyphen = normalized.endsWith('-') && !/[\s_]+$/.test(input)

  // 4. Convert whitespace and underscore to hyphen
  normalized = normalized.replace(/[\s_]+/g, '-')

  // 5. Remove invalid characters (keep only a-z, 0-9, -, /)
  normalized = normalized.replace(/[^a-z0-9\-/]/g, '')

  // 6. Collapse duplicate hyphens
  normalized = normalized.replace(/-+/g, '-')

  // 7. Collapse duplicate slashes
  normalized = normalized.replace(/\/+/g, '/')

  // 8. Trim leading slashes only (preserve trailing slash for nested slug typing)
  normalized = normalized.replace(/^\/+/, '')

  // 9. Segment cleanup (preserves trailing slash if present)
  const hasTrailingSlash = normalized.endsWith('/')
  normalized = cleanupSegments(normalized)
  
  // Restore trailing slash if it was there and we have content
  // This allows users to type "mens/" and continue with "shoes" to make "mens/shoes"
  if (hasTrailingSlash && normalized.length > 0 && !normalized.endsWith('/')) {
    normalized = normalized + '/'
  }
  
  // Restore leading hyphen if user manually typed it
  if (hasLeadingHyphen && !normalized.startsWith('-')) {
    normalized = '-' + normalized
  }
  
  // Restore trailing hyphen if the original input had trailing whitespace or manually typed hyphen
  // This allows users to type "hello " and see "hello-" while typing, or type "hello-" manually
  if ((hasTrailingWhitespace || hasTrailingHyphen) && !normalized.endsWith('-') && !normalized.endsWith('/')) {
    if (normalized.length === 0) {
      // If normalized is empty (e.g., input was just a space or hyphen), return a single hyphen
      normalized = '-'
    } else {
      // Otherwise, append hyphen to preserve the trailing space that was converted or manually typed hyphen
      normalized = normalized + '-'
    }
  }

  // 10. Max length enforcement
  if (normalized.length > maxLength) {
    normalized = normalized.substring(0, maxLength)
    // Re-run cleanup if trimming creates trailing - or /
    normalized = normalized.replace(/[-/]+$/, '')
    normalized = cleanupSegments(normalized)
  }

  return normalized
}

/**
 * Extracts pathname from URL strings
 * @param input - Input string that might be a URL
 * @returns Extracted pathname or original string
 */
function extractPathFromUrl(input: string): string {
  // Check if input looks like a URL
  const urlPattern = /^https?:\/\//
  if (!urlPattern.test(input.trim())) {
    return input
  }

  try {
    const url = new URL(input)
    // Extract pathname and remove leading slash
    let pathname = url.pathname.replace(/^\/+/, '')
    return pathname
  } catch (e) {
    // If URL constructor fails, try manual extraction
    try {
      const match = input.match(/https?:\/\/[^\/]+(\/.*?)(?:\?|#|$)/)
      if (match && match[1]) {
        return match[1].replace(/^\/+/, '')
      }
    } catch (e2) {
      // If all else fails, return original
    }
    return input
  }
}

/**
 * Cleans up slug segments by splitting on / and processing each segment
 * @param input - Slug string with segments separated by /
 * @returns Cleaned slug string
 */
function cleanupSegments(input: string): string {
  if (!input) return ''

  // Split by /
  const segments = input.split('/')

  // Process each segment
  const cleanedSegments = segments
    .map(segment => {
      // Trim leading hyphens
      segment = segment.replace(/^-+/, '')
      // Trim trailing hyphens
      segment = segment.replace(/-+$/, '')
      return segment
    })
    .filter(segment => segment.length > 0) // Remove empty segments

  // Rejoin with /
  return cleanedSegments.join('/')
}

