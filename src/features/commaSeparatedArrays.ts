/**
 * Comma-separated array processing
 *
 * @example
 * parseCommaSeparatedArray('1,2,3') // ['1', '2', '3']
 * stringifyAsCommaSeparated(['1', '2', '3']) // '1,2,3'
 */

/**
 * Check if value is a comma-separated string
 */
export const isCommaSeparatedValue = (value: string): boolean => {
  return value.includes(',')
}

/**
 * Parse comma-separated string into array
 */
export const parseCommaSeparatedArray = (value: string): string[] => {
  return value.split(',')
}

/**
 * Serialize array to comma-separated string
 */
export const stringifyAsCommaSeparated = (values: unknown[]): string => {
  return values.map(String).join(',')
}

/**
 * Convert to array if comma-separated, otherwise return as-is
 */
export const transformCommaSeparatedValue = (
  value: string,
): string | string[] => {
  if (isCommaSeparatedValue(value)) {
    return parseCommaSeparatedArray(value)
  }
  return value
}
