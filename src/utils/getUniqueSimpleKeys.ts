import { extractSimpleKeys } from './extractSimpleKeys'

/**
 * Get unique list of simple keys
 *
 * @example
 * const params = new URLSearchParams('name=john&name=jane&age=30')
 * getUniqueSimpleKeys(params) // ['name', 'age']
 */
export const getUniqueSimpleKeys = (params: URLSearchParams): string[] => {
  return [...new Set(extractSimpleKeys(params))]
}
