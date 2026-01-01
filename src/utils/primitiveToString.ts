/**
 * Convert primitive value to string
 *
 * @example
 * primitiveToString('foo') // 'foo'
 * primitiveToString(123) // '123'
 * primitiveToString(true) // 'true'
 */
export const primitiveToString = (value: string | number | boolean): string => {
  return String(value)
}
