import { describe, expect, it } from 'vitest'

import { parseSearchParams } from './parseSearchParams'
import { parseTestCases, roundTripTestCases } from './sharedTestCases'
import { stringifySearchParams } from './stringifySearchParams'

describe('parseSearchParams', () => {
  describe('shared test cases', () => {
    it.each(parseTestCases)('$description: $input', ({ input, expected }) => {
      expect(parseSearchParams(input)).toEqual(expected)
    })
  })

  describe('PHP-style specific', () => {
    it('removes [] from PHP-style keys', () => {
      const result = parseSearchParams('tags[]=a&tags[]=b')
      expect(result).toHaveProperty('tags')
      expect(result).not.toHaveProperty('tags[]')
    })
  })

  describe('numeric index array specific', () => {
    it('parses sparse arrays', () => {
      const result = parseSearchParams('items[0]=a&items[2]=c')
      expect(result.items).toHaveLength(3)
      expect((result.items as string[])[0]).toBe('a')
      expect((result.items as string[])[2]).toBe('c')
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
