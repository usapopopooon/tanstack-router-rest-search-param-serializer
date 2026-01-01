/**
 * Utilities for processing PHP-style array parameters
 *
 * PHP format: ids[]=1&ids[]=2&ids[]=3
 * - Parse: ids[]=1&ids[]=2 → { ids: ['1', '2'] }
 * - Serialize: { ids: ['1', '2'] } → [['ids[]', '1'], ['ids[]', '2']]
 */

/**
 * Check if key is a PHP-style array key
 * @example isPhpArrayKey('ids[]') // true
 * @example isPhpArrayKey('ids') // false
 * @example isPhpArrayKey('user[name]') // false
 */
export const isPhpArrayKey = (key: string): boolean => {
  return key.endsWith('[]') && !key.slice(0, -2).includes('[')
}

/**
 * Get base key from PHP-style key
 * @example getPhpArrayBaseKey('ids[]') // 'ids'
 */
export const getPhpArrayBaseKey = (key: string): string => {
  return key.endsWith('[]') ? key.slice(0, -2) : key
}

/**
 * Expand primitive array to PHP-style key-value pairs
 * @example expandToPhpArrayPairs('ids', ['1', '2']) // [['ids[]', '1'], ['ids[]', '2']]
 */
export const expandToPhpArrayPairs = (
  key: string,
  values: readonly (string | number | boolean)[],
): [string, string][] => {
  const phpKey = `${key}[]`
  return values.map((value) => [phpKey, String(value)])
}

/**
 * Aggregate PHP-style URLSearchParams entries into arrays
 * @example
 * const entries = [['ids[]', '1'], ['ids[]', '2'], ['name', 'john']]
 * aggregatePhpArrayEntries(entries)
 * // { 'ids': ['1', '2'], 'name': 'john' }
 */
export const aggregatePhpArrayEntries = (
  entries: Iterable<[string, string]>,
): { [key: string]: string | string[] } => {
  const result: { [key: string]: string | string[] } = {}

  for (const [key, value] of entries) {
    if (isPhpArrayKey(key)) {
      const baseKey = getPhpArrayBaseKey(key)
      const existing = result[baseKey]
      if (Array.isArray(existing)) {
        result[baseKey] = [...existing, value]
      } else if (existing !== undefined) {
        result[baseKey] = [existing, value]
      } else {
        result[baseKey] = [value]
      }
    } else {
      const existing = result[key]
      if (Array.isArray(existing)) {
        result[key] = [...existing, value]
      } else if (existing !== undefined) {
        result[key] = [existing, value]
      } else {
        result[key] = value
      }
    }
  }

  return result
}
