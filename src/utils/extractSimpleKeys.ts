import { isSimpleKey } from './isSimpleKey'

/**
 * Extract only simple keys from URLSearchParams
 *
 * @example
 * const params = new URLSearchParams('name=john&user[age]=30')
 * extractSimpleKeys(params) // ['name']
 */
export const extractSimpleKeys = (params: URLSearchParams): string[] => {
  return Array.from(params.keys()).filter(isSimpleKey)
}
