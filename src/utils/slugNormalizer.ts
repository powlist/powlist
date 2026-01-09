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

