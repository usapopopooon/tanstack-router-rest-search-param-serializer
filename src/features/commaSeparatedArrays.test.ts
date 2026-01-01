import { describe, expect, it } from 'vitest'

import {
  isCommaSeparatedValue,
  parseCommaSeparatedArray,
  stringifyAsCommaSeparated,
  transformCommaSeparatedValue,
} from './commaSeparatedArrays'

describe('commaSeparatedArrays', () => {
  describe('isCommaSeparatedValue', () => {
    it('returns true for values containing comma', () => {
      expect(isCommaSeparatedValue('a,b,c')).toBe(true)
    })

    it('returns false for values without comma', () => {
      expect(isCommaSeparatedValue('abc')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isCommaSeparatedValue('')).toBe(false)
    })
  })

  describe('parseCommaSeparatedArray', () => {
    it('splits comma-separated values into array', () => {
      expect(parseCommaSeparatedArray('a,b,c')).toEqual(['a', 'b', 'c'])
    })

    it('splits two comma-separated values into array', () => {
      expect(parseCommaSeparatedArray('1,2')).toEqual(['1', '2'])
    })

    it('splits comma-separated values including empty strings into array', () => {
      expect(parseCommaSeparatedArray('a,,c')).toEqual(['a', '', 'c'])
    })
  })

  describe('stringifyAsCommaSeparated', () => {
    it('converts array to comma-separated string', () => {
      expect(stringifyAsCommaSeparated(['a', 'b', 'c'])).toBe('a,b,c')
    })

    it('converts number array to string', () => {
      expect(stringifyAsCommaSeparated([1, 2, 3])).toBe('1,2,3')
    })

    it('returns empty string for empty array', () => {
      expect(stringifyAsCommaSeparated([])).toBe('')
    })
  })

  describe('transformCommaSeparatedValue', () => {
    it('converts value containing comma to array', () => {
      expect(transformCommaSeparatedValue('a,b,c')).toEqual(['a', 'b', 'c'])
    })

    it('returns value without comma as-is', () => {
      expect(transformCommaSeparatedValue('abc')).toBe('abc')
    })
  })
})
