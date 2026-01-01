import { flattenObject } from './features/nestedObjects/flatten'

/**
 * Serialize an object to URLSearchParams format string
 *
 * - undefined/null values are excluded
 * - Arrays are output in comma-separated format
 * - Nested objects are output in Rails-style (user[name]=value)
 * - Prepends ? if there are query parameters
 */
export const stringifySearchParams = (search: {
  [key: string]: unknown
}): string => {
  const pairs = flattenObject(search)

  if (pairs.length === 0) {
    return ''
  }

  const queryString = new URLSearchParams(pairs).toString()

  return queryString ? `?${queryString}` : ''
}
