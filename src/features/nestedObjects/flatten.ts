/**
 * Object flattening
 *
 * Convert nested objects to Rails-style key-value pairs
 *
 * @example
 * flattenObject({ user: { name: 'john' } })
 * // [['user[name]', 'john']]
 */

/**
 * Check if value is a primitive
 */
const isPrimitive = (value: unknown): boolean => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

/**
 * Convert nested objects to flat key-value pairs
 *
 * @example
 * flattenObject({ user: { name: 'john' } })
 * // [['user[name]', 'john']]
 *
 * flattenObject({ items: [{ name: 'apple' }] })
 * // [['items[0][name]', 'apple']]
 *
 * flattenObject({ ids: ['1', '2'] })
 * // [['ids', '1,2']]  ← Primitive arrays become comma-separated
 */
export const flattenObject = (
  obj: { [key: string]: unknown },
  prefix = '',
): [string, string][] => {
  return Object.entries(obj).flatMap(([key, value]): [string, string][] => {
    if (value === undefined || value === null) {
      return []
    }

    const fullKey = prefix ? `${prefix}[${key}]` : key

    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return [[fullKey, '']]
        }
        if (value.every((item) => isPrimitive(item))) {
          return [[fullKey, value.map(String).join(',')]]
        }
        // Expand each element of object arrays
        return value.flatMap((item, i): [string, string][] => {
          if (item === undefined) return []
          if (typeof item === 'object' && item !== null) {
            return flattenObject(
              item as { [key: string]: unknown },
              `${fullKey}[${i}]`,
            )
          }
          return [[`${fullKey}[${i}]`, String(item)]]
        })
      }
      // Recursively expand objects
      return flattenObject(value as { [key: string]: unknown }, fullKey)
    }

    // Primitive value
    return [[fullKey, String(value)]]
  })
}
