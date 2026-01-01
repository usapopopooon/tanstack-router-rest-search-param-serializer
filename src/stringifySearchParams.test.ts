import { describe, expect, it } from 'vitest'

import { parseSearchParams } from './parseSearchParams'
import { roundTripTestCases, stringifyTestCases } from './sharedTestCases'
import { stringifySearchParams } from './stringifySearchParams'

describe('stringifySearchParams', () => {
  describe('shared test cases', () => {
    it.each(
      stringifyTestCases.filter(
        (c): c is typeof c & { expected: string } => 'expected' in c,
      ),
    )('$description', ({ input, expected }) => {
      expect(stringifySearchParams(input)).toBe(expected)
    })

    it.each(
      stringifyTestCases.filter(
        (c): c is typeof c & { expectedContains: string[] } =>
          'expectedContains' in c,
      ),
    )('$description (contains)', ({ input, expectedContains }) => {
      const result = stringifySearchParams(input)
      for (const contain of expectedContains) {
        expect(result).toContain(contain)
      }
    })
  })

  describe('? prefix', () => {
    it('adds ? when parameters exist', () => {
      const result = stringifySearchParams({ a: '1' })
      expect(result.startsWith('?')).toBe(true)
    })

    it('does not add ? when no parameters', () => {
      expect(stringifySearchParams({})).toBe('')
    })
  })

  describe('verify no double quotes are added (difference from JSON.stringify)', () => {
    it('no double quotes added to strings', () => {
      const result = stringifySearchParams({ token: 'abc123' })
      expect(result).toBe('?token=abc123')
      expect(result).not.toContain('"')
    })

    it('no double quotes added to numbers', () => {
      const result = stringifySearchParams({ page: 1, limit: 10 })
      expect(result).toBe('?page=1&limit=10')
      expect(result).not.toContain('"')
    })

    it('no double quotes added to booleans', () => {
      const result = stringifySearchParams({ active: true, deleted: false })
      expect(result).toBe('?active=true&deleted=false')
      expect(result).not.toContain('"')
    })

    it('no double quotes added to numeric arrays', () => {
      const result = stringifySearchParams({ ids: [1, 2, 3] })
      expect(result).toBe('?ids=1%2C2%2C3')
      expect(result).not.toContain('"')
    })

    it('no double quotes added to complex objects like those passed to navigate', () => {
      const result = stringifySearchParams({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        hasError: false,
        page: 1,
      })
      expect(result).not.toContain('"')
      expect(result).toContain('token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
      expect(result).toContain('hasError=false')
      expect(result).toContain('page=1')
    })
  })

  describe('round trip', () => {
    it.each(roundTripTestCases)(
      '$description: stringify then parse returns original',
      ({ data }) => {
        const stringified = stringifySearchParams(data)
        const parsed = parseSearchParams(stringified)
        expect(parsed).toEqual(data)
      },
    )
  })
})
