import { describe, expect, it } from 'vitest'

import { isSimpleKey } from './isSimpleKey'

describe('isSimpleKey', () => {
  it('returns true for simple keys', () => {
    expect(isSimpleKey('foo')).toBe(true)
  })

  it('returns true for empty string', () => {
    expect(isSimpleKey('')).toBe(true)
  })

  it('returns true for numeric-only keys', () => {
    expect(isSimpleKey('123')).toBe(true)
  })

  it('returns true for keys containing underscores', () => {
    expect(isSimpleKey('user_name')).toBe(true)
  })

  it('returns true for keys containing hyphens', () => {
    expect(isSimpleKey('user-name')).toBe(true)
  })

  it('returns false for Rails-style keys', () => {
    expect(isSimpleKey('user[name]')).toBe(false)
  })

  it('returns false for PHP-style keys', () => {
    expect(isSimpleKey('ids[]')).toBe(false)
  })

  it('returns false for numeric index keys', () => {
    expect(isSimpleKey('items[0]')).toBe(false)
  })

  it('returns false for deeply nested keys', () => {
    expect(isSimpleKey('user[address][city]')).toBe(false)
  })
})
