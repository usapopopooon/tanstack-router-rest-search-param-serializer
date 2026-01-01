import { describe, expect, it } from 'vitest'

import { primitiveToString } from './primitiveToString'

describe('primitiveToString', () => {
  it('returns strings as-is', () => {
    expect(primitiveToString('foo')).toBe('foo')
  })

  it('returns empty strings as-is', () => {
    expect(primitiveToString('')).toBe('')
  })

  it('converts numbers to strings', () => {
    expect(primitiveToString(123)).toBe('123')
  })

  it('converts 0 to string', () => {
    expect(primitiveToString(0)).toBe('0')
  })

  it('converts negative numbers to strings', () => {
    expect(primitiveToString(-42)).toBe('-42')
  })

  it('converts decimals to strings', () => {
    expect(primitiveToString(3.14)).toBe('3.14')
  })

  it('converts true to string', () => {
    expect(primitiveToString(true)).toBe('true')
  })

  it('converts false to string', () => {
    expect(primitiveToString(false)).toBe('false')
  })
})
