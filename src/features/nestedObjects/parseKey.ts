/**
 * Nested key parsing
 *
 * Convert Rails-style nested keys (user[name]) to an array
 *
 * @example
 * parseNestedKey('user[name]') // ['user', 'name']
 * parseNestedKey('items[0][name]') // ['items', '0', 'name']
 * parseNestedKey('ids[]') // ['ids', '']
 */

/**
 * Check if key is in nested format
 */
export const isNestedKey = (key: string): boolean => {
  return key.includes('[')
}

/**
 * Parse nested key into an array
 *
 * @example
 * parseNestedKey('user[name]') // ['user', 'name']
 * parseNestedKey('items[0][name]') // ['items', '0', 'name']
 * parseNestedKey('ids[]') // ['ids', '']
 * parseNestedKey('simple') // ['simple']
 */
export const parseNestedKey = (key: string): string[] => {
  // Return as-is if no brackets
  const bracketIndex = key.indexOf('[')
  if (bracketIndex === -1) {
    return [key]
  }

  // Part before the first bracket (root key)
  const rootKey = key.slice(0, bracketIndex)

  // Extract and parse the bracket part
  const bracketPart = key.slice(bracketIndex)
  const bracketKeys = parseBracketPart(bracketPart)

  // If root key is empty (format like [foo]), return only bracketKeys
  // If root key exists, prepend it
  return rootKey ? [rootKey, ...bracketKeys] : bracketKeys
}

/**
 * Parse bracket part into an array
 *
 * @example
 * parseBracketPart('[name]') // ['name']
 * parseBracketPart('[0][name]') // ['0', 'name']
 * parseBracketPart('[][]') // ['', '']
 */
const parseBracketPart = (bracketPart: string): string[] => {
  // Extract all [...] using regex
  const matches = bracketPart.match(/\[([^\]]*)\]/g)
  if (!matches) {
    return []
  }

  // Remove [] from each match to extract the content
  return matches.map((match) => match.slice(1, -1))
}
