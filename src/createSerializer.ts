import { parseBooleanString } from './features/booleanStrings'
import {
  isCommaSeparatedValue,
  parseCommaSeparatedArray,
} from './features/commaSeparatedArrays'
import { tryParseJsonValue } from './features/jsonFallback'
import { flattenObject } from './features/nestedObjects/flatten'
import { parseNestedKey } from './features/nestedObjects/parseKey'
import { setNestedValue } from './features/nestedObjects/setValue'

/**
 * Serializer feature options
 */
export type SerializerFeatures = {
  /** Parse/serialize comma-separated arrays (default: true) */
  commaSeparatedArrays?: boolean
  /** Convert boolean strings (default: true) */
  booleanStrings?: boolean
  /** Rails-style nested objects (default: true) */
  nestedObjects?: boolean
  /** PHP-style arrays ids[]=1&ids[]=2 (default: true) */
  phpArrays?: boolean
  /** Duplicate key arrays ids=1&ids=2 (default: true) */
  duplicateKeyArrays?: boolean
  /** Numeric index arrays items[0]=a (default: true) */
  numericIndexArrays?: boolean
  /** JSON fallback for backward compatibility with TanStack Router default URLs (default: false) */
  jsonFallback?: boolean
}

/**
 * All features enabled (default)
 */
export const FULL_FEATURES: Required<SerializerFeatures> = {
  commaSeparatedArrays: true,
  booleanStrings: true,
  nestedObjects: true,
  phpArrays: true,
  duplicateKeyArrays: true,
  numericIndexArrays: true,
  jsonFallback: false,
}

/**
 * Simple features only (standard format + boolean conversion)
 */
export const SIMPLE_FEATURES: Required<SerializerFeatures> = {
  commaSeparatedArrays: false,
  booleanStrings: true,
  nestedObjects: false,
  phpArrays: false,
  duplicateKeyArrays: false,
  numericIndexArrays: false,
  jsonFallback: false,
}

/**
 * Create a custom serializer
 */
export const createSerializer = (features: SerializerFeatures = {}) => {
  const opts: Required<SerializerFeatures> = { ...FULL_FEATURES, ...features }

  /**
   * Parse a URLSearchParams format string
   */
  const parseSearchParams = (searchStr: string): { [key: string]: unknown } => {
    const params = new URLSearchParams(searchStr)

    // Check if there are nested keys
    const hasNestedKeys =
      opts.nestedObjects &&
      Array.from(params.keys()).some((key) => key.includes('['))

    // If no nested keys, use simple processing
    if (!hasNestedKeys) {
      const uniqueKeys = [...new Set(Array.from(params.keys()))]

      return uniqueKeys.reduce<{ [key: string]: unknown }>((acc, key) => {
        const values = params.getAll(key)

        // Duplicate key arrays
        if (opts.duplicateKeyArrays && values.length > 1) {
          return { ...acc, [key]: values }
        }

        // Single value
        const rawValue = values[0]
        const parsed = applyValueTransforms(rawValue, opts)
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

      // Simple key with multiple values
      if (keys.length === 1 && values.length > 1 && opts.duplicateKeyArrays) {
        return { ...acc, [keys[0]]: values }
      }

      // Set each value (accumulate with reduce)
      return values.reduce<{ [key: string]: unknown }>(
        (innerAcc, value) => setNestedValue(innerAcc, keys, value),
        acc,
      )
    }, {})

    // Apply value transformations
    return applyParseSearchValueRecursive(result, opts) as {
      [key: string]: unknown
    }
  }

  /**
   * Serialize an object to URLSearchParams format string
   */
  const stringifySearchParams = (search: {
    [key: string]: unknown
  }): string => {
    const pairs = opts.nestedObjects
      ? flattenObject(search)
      : flattenSimple(search)

    if (pairs.length === 0) {
      return ''
    }

    const queryString = new URLSearchParams(pairs).toString()
    return queryString ? `?${queryString}` : ''
  }

  return {
    parseSearchParams,
    stringifySearchParams,
  }
}

/**
 * Apply value transformations (boolean, comma-separated arrays, JSON fallback)
 */
const applyValueTransforms = (
  value: string,
  opts: Required<SerializerFeatures>,
): unknown => {
  // JSON fallback (for backward compatibility with TanStack Router default URLs)
  if (opts.jsonFallback) {
    const jsonParsed = tryParseJsonValue(value)
    if (jsonParsed !== value) {
      return jsonParsed
    }
  }

  if (opts.booleanStrings) {
    if (value === 'true') return true
    if (value === 'false') return false
  }

  if (opts.commaSeparatedArrays && value.includes(',')) {
    return value.split(',')
  }

  return value
}

/**
 * Recursively apply transformations to all string values in an object
 */
const applyParseSearchValueRecursive = (
  obj: unknown,
  opts: Required<SerializerFeatures>,
): unknown => {
  if (typeof obj === 'string') {
    return applyValueTransforms(obj, opts)
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => applyParseSearchValueRecursive(item, opts))
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj as { [key: string]: unknown }).map(([key, value]) => [
        key,
        applyParseSearchValueRecursive(value, opts),
      ]),
    )
  }

  return obj
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
 * Simple flattening (no nesting)
 */
const flattenSimple = (obj: { [key: string]: unknown }): [string, string][] => {
  return Object.entries(obj).reduce<[string, string][]>((acc, [key, value]) => {
    if (value === null || value === undefined) {
      return acc
    }

    if (Array.isArray(value)) {
      return [...acc, [key, value.map(String).join(',')]]
    }

    if (typeof value === 'object') {
      // Ignore nested objects
      return acc
    }

    return [...acc, [key, String(value)]]
  }, [])
}

/**
 * Parse a string value (boolean conversion, comma-separated arrays)
 * Exported for backwards compatibility
 */
export const parseSearchValue = (value: string): unknown => {
  const boolResult = parseBooleanString(value)
  if (typeof boolResult === 'boolean') {
    return boolResult
  }

  if (isCommaSeparatedValue(value)) {
    return parseCommaSeparatedArray(value)
  }

  return value
}
