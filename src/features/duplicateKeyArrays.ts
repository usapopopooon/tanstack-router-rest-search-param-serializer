/**
 * Utilities for processing duplicate key arrays
 *
 * Duplicate key format: ids=1&ids=2&ids=3
 * - Parse: ids=1&ids=2 → { ids: ['1', '2'] }
 * - Serialize: { ids: ['1', '2'] } → [['ids', '1'], ['ids', '2']]
 */

/**
 * Aggregate values of the same key into a Map
 * @example
 * const params = new URLSearchParams('ids=1&ids=2&name=john')
 * aggregateDuplicateKeys(params)
 * // Map { 'ids' => ['1', '2'], 'name' => ['john'] }
 */
export const aggregateDuplicateKeys = (
  params: URLSearchParams,
): Map<string, string[]> => {
  const result = new Map<string, string[]>()

  for (const [key, value] of params.entries()) {
    const existing = result.get(key) ?? []
    result.set(key, [...existing, value])
  }

  return result
}

/**
 * Check if there are duplicate keys
 * @example
 * hasDuplicateKeys(new URLSearchParams('ids=1&ids=2')) // true
 * hasDuplicateKeys(new URLSearchParams('id=1&name=john')) // false
 */
export const hasDuplicateKeys = (params: URLSearchParams): boolean => {
  const keys = Array.from(params.keys())
  return new Set(keys).size !== keys.length
}

/**
 * Expand array to duplicate key format key-value pairs
 * @example expandToDuplicateKeyPairs('ids', ['1', '2']) // [['ids', '1'], ['ids', '2']]
 */
export const expandToDuplicateKeyPairs = (
  key: string,
  values: readonly (string | number | boolean)[],
): [string, string][] => {
  return values.map((value) => [key, String(value)])
}

/**
 * Return single value or array based on length
 * @example
 * resolveArrayOrSingle(['1']) // '1'
 * resolveArrayOrSingle(['1', '2']) // ['1', '2']
 */
export const resolveArrayOrSingle = <T>(values: T[]): T | T[] => {
  return values.length === 1 ? values[0] : values
}
