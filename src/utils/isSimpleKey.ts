/**
 * Check if key is simple (no brackets)
 *
 * @example
 * isSimpleKey('foo') // true
 * isSimpleKey('user[name]') // false
 * isSimpleKey('ids[]') // false
 */
export const isSimpleKey = (key: string): boolean => {
  return !key.includes('[')
}
