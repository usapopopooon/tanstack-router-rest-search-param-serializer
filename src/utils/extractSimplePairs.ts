import { primitiveToString } from './primitiveToString'

/**
 * Extract simple key-value pairs from an object
 * Excludes nested objects and arrays
 *
 * @example
 * extractSimplePairs({ name: 'john', age: 30, user: { id: 1 } })
 * // [['name', 'john'], ['age', '30']]
 */
export const extractSimplePairs = (obj: {
  [key: string]: unknown
}): [string, string][] => {
  return Object.entries(obj).reduce<[string, string][]>((acc, [key, value]) => {
    if (value === null || value === undefined) {
      return acc
    }

    if (typeof value === 'string') {
      return [...acc, [key, value]]
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return [...acc, [key, primitiveToString(value)]]
    }

    // Skip arrays and objects
    return acc
  }, [])
}
