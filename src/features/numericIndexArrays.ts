/**
 * Utilities for processing numeric index arrays
 *
 * Numeric index format: items[0]=a&items[1]=b
 * - Parse: items[0]=a&items[1]=b → { items: ['a', 'b'] }
 * - Serialize: { items: ['a', 'b'] } → items[0]=a&items[1]=b
 */

/**
 * Check if key is a numeric index
 * @example isNumericIndex('0') // true
 * @example isNumericIndex('123') // true
 * @example isNumericIndex('name') // false
 * @example isNumericIndex('') // false
 */
export const isNumericIndex = (key: string): boolean => {
  return /^\d+$/.test(key)
}

/**
 * Convert numeric index to integer
 * @example parseNumericIndex('0') // 0
 * @example parseNumericIndex('123') // 123
 */
export const parseNumericIndex = (key: string): number => {
  return parseInt(key, 10)
}

/**
 * Set value at specified index in array (immutable)
 * Extends array if index exceeds array size
 *
 * @example
 * setArrayAtIndex([], 0, 'a') // ['a']
 * setArrayAtIndex(['a'], 2, 'c') // ['a', undefined, 'c']
 * setArrayAtIndex(['a', 'b'], 1, 'x') // ['a', 'x']
 */
export const setArrayAtIndex = <T>(
  array: readonly T[],
  index: number,
  value: T,
): T[] => {
  if (index >= array.length) {
    return Array.from({ length: index + 1 }, (_, i) =>
      i === index ? value : array[i],
    )
  }
  return array.map((item, i) => (i === index ? value : item))
}

/**
 * Expand array to numeric index format key-value pairs
 * @example
 * expandToNumericIndexPairs('items', ['a', 'b'])
 * // [['items[0]', 'a'], ['items[1]', 'b']]
 */
export const expandToNumericIndexPairs = (
  key: string,
  values: readonly (string | number | boolean)[],
): [string, string][] => {
  return values.map((value, index) => [`${key}[${index}]`, String(value)])
}
