/**
 * Nested object processing (Rails-style)
 *
 * Parse: user[name]=john → { user: { name: 'john' } }
 * Serialize: { user: { name: 'john' } } → user[name]=john
 */

export { flattenObject } from './flatten'
export { isNestedKey, parseNestedKey } from './parseKey'
export { setNestedValue } from './setValue'
