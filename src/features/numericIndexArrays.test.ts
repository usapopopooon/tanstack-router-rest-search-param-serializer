import { describe, expect, it } from 'vitest'

import {
  expandToNumericIndexPairs,
  isNumericIndex,
  parseNumericIndex,
  setArrayAtIndex,
} from './numericIndexArrays'

describe('numericIndexArrays', () => {
  describe('isNumericIndex', () => {
    it('returns true for digit-only strings', () => {
      expect(isNumericIndex('0')).toBe(true)
      expect(isNumericIndex('123')).toBe(true)
    })

    it('returns false for strings containing letters', () => {
      expect(isNumericIndex('name')).toBe(false)
      expect(isNumericIndex('0a')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isNumericIndex('')).toBe(false)
    })
  })

  describe('parseNumericIndex', () => {
    it('converts digit string to integer', () => {
      expect(parseNumericIndex('0')).toBe(0)
      expect(parseNumericIndex('123')).toBe(123)
    })
  })

  describe('setArrayAtIndex', () => {
    it('sets value at index 0 for empty array', () => {
      expect(setArrayAtIndex([], 0, 'a')).toEqual(['a'])
    })

    it('expands array and sets value at index 2', () => {
      // eslint-disable-next-line no-sparse-arrays
      expect(setArrayAtIndex([], 2, 'c')).toEqual([, , 'c'])
    })

    it('overwrites existing value', () => {
      expect(setArrayAtIndex(['a', 'b'], 1, 'x')).toEqual(['a', 'x'])
    })

    it('does not mutate original array (immutable)', () => {
      const original = ['a', 'b']
      const result = setArrayAtIndex(original, 1, 'x')
      expect(original).toEqual(['a', 'b'])
      expect(result).toEqual(['a', 'x'])
    })
  })

  describe('expandToNumericIndexPairs', () => {
    it('expands array into numeric index format pairs', () => {
      expect(expandToNumericIndexPairs('items', ['a', 'b', 'c'])).toEqual([
        ['items[0]', 'a'],
        ['items[1]', 'b'],
        ['items[2]', 'c'],
      ])
    })

    it('converts number array to strings and expands into pairs', () => {
      expect(expandToNumericIndexPairs('ids', [1, 2, 3])).toEqual([
        ['ids[0]', '1'],
        ['ids[1]', '2'],
        ['ids[2]', '3'],
      ])
    })

    it('returns empty pair array for empty array', () => {
      expect(expandToNumericIndexPairs('items', [])).toEqual([])
    })
  })
})
