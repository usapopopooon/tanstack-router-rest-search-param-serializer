import { parseBooleanString } from './features/booleanStrings'
import {
  isCommaSeparatedValue,
  parseCommaSeparatedArray,
} from './features/commaSeparatedArrays'
import { parseNestedKey } from './features/nestedObjects/parseKey'
import { setNestedValue } from './features/nestedObjects/setValue'

/**
 * Parse a string value (boolean conversion, comma-separated arrays)
 */
const parseSearchValue = (value: string): unknown => {
  // Boolean conversion
  const boolResult = parseBooleanString(value)
  if (typeof boolResult === 'boolean') {
    return boolResult
  }

  // Comma-separated array
  if (isCommaSeparatedValue(value)) {
    return parseCommaSeparatedArray(value)
  }

  return value
}

/**
 * Parse a URLSearchParams format string into an object
 *
 * Supported formats:
 * - Comma-separated arrays: ?ids=1,2,3
 * - PHP-style arrays: ?ids[]=1&ids[]=2
 * - Duplicate key arrays: ?ids=1&ids=2
 * - Nested objects: ?user[name]=john&user[age]=30
 * - Objects in arrays: ?items[0][name]=apple&items[0][price]=100
 * - Numeric index arrays: ?items[0]=a&items[2]=c
 */
export const parseSearchParams = (
  searchStr: string,
): { [key: string]: unknown } => {
  const params = new URLSearchParams(searchStr)

  // Check if there are nested keys
  const hasNestedKeys = Array.from(params.keys()).some((key) =>
    key.includes('['),
  )

  // If no nested keys, use simple processing
  if (!hasNestedKeys) {
    const uniqueKeys = [...new Set(Array.from(params.keys()))]

    return uniqueKeys.reduce<{ [key: string]: unknown }>((acc, key) => {
      const values = params.getAll(key)
      const parsed =
        values.length > 1
          ? values // Multiple values as array
          : parseSearchValue(values[0])
      return { ...acc, [key]: parsed }
    }, {})
  }

  // Processing for nested keys

  // Build a map to aggregate duplicate key values
  const keyValuesMap = buildKeyValuesMap(params)

  // Build nested object structure from the map
  const result = Array.from(keyValuesMap.entries()).reduce<{
    [key: string]: unknown
  }>((acc, [key, values]) => {
    const keys = parseNestedKey(key)

    // Simple key (no brackets) with multiple values is treated as array
    if (keys.length === 1 && values.length > 1) {
      return { ...acc, [keys[0]]: values }
    }

    // Set each value (accumulate with reduce)
    return values.reduce(
      (innerAcc, value) => setNestedValue(innerAcc, keys, value),
      acc,
    )
  }, {})

  // Apply parseSearchValue to final values (boolean conversion, comma-separated arrays)
  return applyParseSearchValue(result) as { [key: string]: unknown }
}

/**
 * Build a map to aggregate duplicate key values from URLSearchParams
 */
const buildKeyValuesMap = (params: URLSearchParams): Map<string, string[]> => {
  return Array.from(params.entries()).reduce((map, [key, value]) => {
    const existing = map.get(key) ?? []
    map.set(key, [...existing, value])
    return map
  }, new Map<string, string[]>())
}

/**
 * Recursively apply parseSearchValue to all string values in an object
 */
const applyParseSearchValue = (obj: unknown): unknown => {
  if (typeof obj === 'string') {
    return parseSearchValue(obj)
  }

  if (Array.isArray(obj)) {
    return obj.map(applyParseSearchValue)
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj as { [key: string]: unknown }).map(([key, value]) => [
        key,
        applyParseSearchValue(value),
      ]),
    )
  }

  return obj
}
