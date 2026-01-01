/**
 * Boolean string conversion
 *
 * @example
 * parseBooleanString('true')  // true
 * parseBooleanString('false') // false
 * parseBooleanString('other') // 'other'
 */

/**
 * Check if value is a boolean string
 */
export const isBooleanString = (value: string): boolean => {
  return value === 'true' || value === 'false'
}

/**
 * Convert boolean string to boolean
 * Returns original value if not a boolean string
 */
export const parseBooleanString = (value: string): boolean | string => {
  if (value === 'true') return true
  if (value === 'false') return false
  return value
}

/**
 * Convert boolean to string
 */
export const stringifyBoolean = (value: boolean): string => {
  return String(value)
}
