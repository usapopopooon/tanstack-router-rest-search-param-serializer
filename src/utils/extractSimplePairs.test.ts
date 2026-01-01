import { describe, expect, it } from 'vitest'

import { extractSimplePairs } from './extractSimplePairs'

describe('extractSimplePairs', () => {
  it('extracts string values as pairs', () => {
    expect(extractSimplePairs({ name: 'john' })).toEqual([['name', 'john']])
  })

  it('converts numbers to strings and extracts as pairs', () => {
    expect(extractSimplePairs({ age: 30 })).toEqual([['age', '30']])
  })

  it('converts booleans to strings and extracts as pairs', () => {
    expect(extractSimplePairs({ active: true })).toEqual([['active', 'true']])
  })

  it('extracts multiple primitive values as pairs', () => {
    expect(extractSimplePairs({ name: 'john', age: 30, active: true })).toEqual(
      [
        ['name', 'john'],
        ['age', '30'],
        ['active', 'true'],
      ],
    )
  })

  it('skips null values', () => {
    expect(extractSimplePairs({ name: 'john', empty: null })).toEqual([
      ['name', 'john'],
    ])
  })

  it('skips undefined values', () => {
    expect(extractSimplePairs({ name: 'john', empty: undefined })).toEqual([
      ['name', 'john'],
    ])
  })

  it('skips array values', () => {
    expect(extractSimplePairs({ name: 'john', ids: [1, 2, 3] })).toEqual([
      ['name', 'john'],
    ])
  })

  it('skips object values', () => {
    expect(extractSimplePairs({ name: 'john', user: { id: 1 } })).toEqual([
      ['name', 'john'],
    ])
  })

  it('returns empty array for empty object', () => {
    expect(extractSimplePairs({})).toEqual([])
  })
})
