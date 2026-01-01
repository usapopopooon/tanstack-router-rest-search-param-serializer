import { describe, expect, it } from 'vitest'

import { extractSimpleKeys } from './extractSimpleKeys'

describe('extractSimpleKeys', () => {
  it('extracts simple keys', () => {
    const params = new URLSearchParams('name=john&age=30')
    expect(extractSimpleKeys(params)).toEqual(['name', 'age'])
  })

  it('excludes Rails-style keys', () => {
    const params = new URLSearchParams('name=john&user[age]=30')
    expect(extractSimpleKeys(params)).toEqual(['name'])
  })

  it('excludes PHP-style keys', () => {
    const params = new URLSearchParams('name=john&ids[]=1&ids[]=2')
    expect(extractSimpleKeys(params)).toEqual(['name'])
  })

  it('correctly extracts from mixed formats', () => {
    const params = new URLSearchParams(
      'name=john&user[age]=30&ids[]=1&active=true',
    )
    expect(extractSimpleKeys(params)).toEqual(['name', 'active'])
  })

  it('returns empty array for empty URLSearchParams', () => {
    const params = new URLSearchParams('')
    expect(extractSimpleKeys(params)).toEqual([])
  })

  it('returns all duplicate keys', () => {
    const params = new URLSearchParams('id=1&id=2&name=john')
    expect(extractSimpleKeys(params)).toEqual(['id', 'id', 'name'])
  })
})
