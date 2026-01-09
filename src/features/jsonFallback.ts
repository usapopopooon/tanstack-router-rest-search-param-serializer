/**
 * JSON format fallback for backward compatibility with TanStack Router default URLs
 *
 * Detects and parses JSON-encoded values from TanStack Router's default format:
 * - JSON arrays: ["1","2"] → ['1', '2']
 * - JSON strings: "123" → '123'
 * - JSON objects: {"key":"value"} → { key: 'value' }
 */

/**
 * Check if a value looks like a JSON array
 * @example isJsonArrayValue('["1","2"]') // true
 */
export const isJsonArrayValue = (value: string): boolean => {
  return value.startsWith('[') && value.endsWith(']')
}

/**
 * Check if a value looks like a JSON string
 * @example isJsonStringValue('"123"') // true
 */
export const isJsonStringValue = (value: string): boolean => {
  return value.startsWith('"') && value.endsWith('"')
}

/**
 * Check if a value looks like a JSON object
 * @example isJsonObjectValue('{"name":"john"}') // true
 */
export const isJsonObjectValue = (value: string): boolean => {
  return value.startsWith('{') && value.endsWith('}')
}

/**
 * Check if a value is JSON-encoded (array, string, or object)
 */
export const isJsonEncodedValue = (value: string): boolean => {
  return (
    isJsonArrayValue(value) ||
    isJsonStringValue(value) ||
    isJsonObjectValue(value)
  )
}

/**
 * Try to parse a value as JSON
 * Returns the parsed value on success, or the original value on failure
 */
export const tryParseJsonValue = (value: string): unknown => {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}
