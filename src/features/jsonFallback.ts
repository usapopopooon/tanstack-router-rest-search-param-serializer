/**
 * JSON format fallback for backward compatibility with TanStack Router default URLs
 *
 * Detects and parses JSON-encoded values from TanStack Router's default format:
 * - JSON arrays: ["1","2"] → ['1', '2']
 * - JSON strings: "123" → '123'
 * - JSON objects: {"key":"value"} → { key: 'value' }
 */

/**
 * Try to parse a value as JSON
 * Returns the parsed value on success, or the original value on failure
 */
export const tryParseJsonValue = (value: string): unknown => {
  // JSON array
  if (value.startsWith('[') && value.endsWith(']')) {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  // JSON string ("123" etc.)
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  // JSON object
  if (value.startsWith('{') && value.endsWith('}')) {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  return value
}

/**
 * Check if a value is JSON-encoded
 */
export const isJsonEncodedValue = (value: string): boolean => {
  return (
    (value.startsWith('[') && value.endsWith(']')) ||
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith('{') && value.endsWith('}'))
  )
}
