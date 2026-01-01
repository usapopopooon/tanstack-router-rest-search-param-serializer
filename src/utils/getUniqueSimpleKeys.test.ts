import { describe, expect, it } from 'vitest'

import { getUniqueSimpleKeys } from './getUniqueSimpleKeys'

describe('getUniqueSimpleKeys', () => {
  it('returns unique simple keys', () => {
    const params = new URLSearchParams('name=john&age=30')
    expect(getUniqueSimpleKeys(params)).toEqual(['name', 'age'])
  })

  it('deduplicates duplicate keys', () => {
    const params = new URLSearchParams('id=1&id=2&id=3')
    expect(getUniqueSimpleKeys(params)).toEqual(['id'])
  })

  it('excludes Rails-style keys', () => {
    const params = new URLSearchParams('name=john&user[age]=30')
    expect(getUniqueSimpleKeys(params)).toEqual(['name'])
  })

  it('returns empty array for empty URLSearchParams', () => {
    const params = new URLSearchParams('')
    expect(getUniqueSimpleKeys(params)).toEqual([])
  })

  it('preserves key order', () => {
    const params = new URLSearchParams('z=1&a=2&m=3')
    expect(getUniqueSimpleKeys(params)).toEqual(['z', 'a', 'm'])
  })
})
