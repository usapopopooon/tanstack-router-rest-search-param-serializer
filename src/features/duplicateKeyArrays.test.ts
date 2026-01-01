import { describe, expect, it } from 'vitest'

import {
  aggregateDuplicateKeys,
  expandToDuplicateKeyPairs,
  hasDuplicateKeys,
  resolveArrayOrSingle,
} from './duplicateKeyArrays'

describe('duplicateKeyArrays', () => {
  describe('aggregateDuplicateKeys', () => {
    it('aggregates duplicate key values into an array', () => {
      const params = new URLSearchParams('ids=1&ids=2&ids=3')
      const result = aggregateDuplicateKeys(params)
      expect(result.get('ids')).toEqual(['1', '2', '3'])
    })

    it('returns single key as array', () => {
      const params = new URLSearchParams('name=john')
      const result = aggregateDuplicateKeys(params)
      expect(result.get('name')).toEqual(['john'])
    })

    it('handles multiple different keys', () => {
      const params = new URLSearchParams('id=1&id=2&name=john')
      const result = aggregateDuplicateKeys(params)
      expect(result.get('id')).toEqual(['1', '2'])
      expect(result.get('name')).toEqual(['john'])
    })

    it('returns empty Map for empty URLSearchParams', () => {
      const params = new URLSearchParams('')
      const result = aggregateDuplicateKeys(params)
      expect(result.size).toBe(0)
    })

    it('preserves value order', () => {
      const params = new URLSearchParams('ids=3&ids=1&ids=2')
      const result = aggregateDuplicateKeys(params)
      expect(result.get('ids')).toEqual(['3', '1', '2'])
    })
  })

  describe('hasDuplicateKeys', () => {
    it('returns true when duplicate keys exist', () => {
      const params = new URLSearchParams('ids=1&ids=2')
      expect(hasDuplicateKeys(params)).toBe(true)
    })

    it('returns false when no duplicate keys exist', () => {
      const params = new URLSearchParams('id=1&name=john')
      expect(hasDuplicateKeys(params)).toBe(false)
    })

    it('returns false for empty URLSearchParams', () => {
      const params = new URLSearchParams('')
      expect(hasDuplicateKeys(params)).toBe(false)
    })

    it('returns false for single key', () => {
      const params = new URLSearchParams('id=1')
      expect(hasDuplicateKeys(params)).toBe(false)
    })

    it('returns true for three or more duplicates', () => {
      const params = new URLSearchParams('ids=1&ids=2&ids=3&ids=4')
      expect(hasDuplicateKeys(params)).toBe(true)
    })
  })

  describe('expandToDuplicateKeyPairs', () => {
    it('expands string array into duplicate key format pairs', () => {
      expect(expandToDuplicateKeyPairs('ids', ['1', '2', '3'])).toEqual([
        ['ids', '1'],
        ['ids', '2'],
        ['ids', '3'],
      ])
    })

    it('converts number array to strings and expands into pairs', () => {
      expect(expandToDuplicateKeyPairs('ids', [1, 2, 3])).toEqual([
        ['ids', '1'],
        ['ids', '2'],
        ['ids', '3'],
      ])
    })

    it('converts boolean array to strings and expands into pairs', () => {
      expect(expandToDuplicateKeyPairs('flags', [true, false])).toEqual([
        ['flags', 'true'],
        ['flags', 'false'],
      ])
    })

    it('returns empty pair array for empty array', () => {
      expect(expandToDuplicateKeyPairs('ids', [])).toEqual([])
    })

    it('returns pair array even for single element', () => {
      expect(expandToDuplicateKeyPairs('ids', ['1'])).toEqual([['ids', '1']])
    })
  })

  describe('resolveArrayOrSingle', () => {
    it('returns element for single-element array', () => {
      expect(resolveArrayOrSingle(['1'])).toBe('1')
    })

    it('returns array as-is for multiple elements', () => {
      expect(resolveArrayOrSingle(['1', '2'])).toEqual(['1', '2'])
    })

    it('returns empty array for empty array', () => {
      expect(resolveArrayOrSingle([])).toEqual([])
    })

    it('works with array of objects', () => {
      expect(resolveArrayOrSingle([{ id: 1 }])).toEqual({ id: 1 })
    })

    it('returns array as-is for multiple objects', () => {
      expect(resolveArrayOrSingle([{ id: 1 }, { id: 2 }])).toEqual([
        { id: 1 },
        { id: 2 },
      ])
    })
  })
})
