/**
 * REST API compliant search param serializer for TanStack Router
 *
 * Uses URLSearchParams format instead of default JSON.stringify/parse,
 * conforming to REST API specifications.
 *
 * Supported formats:
 * - Standard format: ?foo=bar&baz=qux
 * - Comma-separated arrays: ?ids=1,2,3
 * - PHP-style arrays: ?ids[]=1&ids[]=2
 * - Duplicate key arrays: ?ids=1&ids=2
 * - Nested objects (Rails-style): ?user[name]=john&user[age]=30
 * - Objects in arrays: ?items[0][name]=apple&items[0][price]=100
 * - Numeric index arrays: ?items[0]=a&items[1]=b
 * - Boolean strings: "true"/"false" → true/false
 *
 * @example
 * // All features enabled (default)
 * import { parseSearchParams, stringifySearchParams } from './restSearchParamSerializer'
 *
 * @example
 * // Custom feature selection
 * import { createSerializer, SIMPLE_FEATURES } from './restSearchParamSerializer'
 * const { parseSearchParams, stringifySearchParams } = createSerializer(SIMPLE_FEATURES)
 */

// Default export with all features enabled
export { parseSearchParams } from './parseSearchParams'
export { stringifySearchParams } from './stringifySearchParams'

// Custom serializer creation
export {
  createSerializer,
  FULL_FEATURES,
  type SerializerFeatures,
  SIMPLE_FEATURES,
} from './createSerializer'

// Internal modules (available for direct use if needed)
export * from './features'
export * from './utils'
