import { describe, expect, it } from 'vitest'

import {
  createSerializer,
  FULL_FEATURES,
  SIMPLE_FEATURES,
} from './createSerializer'
import {
  parseTestCases,
  roundTripTestCases,
  stringifyTestCases,
} from './sharedTestCases'

describe('createSerializer', () => {
  describe('FULL_FEATURES (default)', () => {
    const { parseSearchParams, stringifySearchParams } = createSerializer()

    describe('shared parse test cases', () => {
      it.each(parseTestCases)('$description: $input', ({ input, expected }) => {
        expect(parseSearchParams(input)).toEqual(expected)
      })
    })

    describe('shared stringify test cases', () => {
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

  describe('SIMPLE_FEATURES', () => {
    const { parseSearchParams, stringifySearchParams } =
      createSerializer(SIMPLE_FEATURES)

    it('parses standard format', () => {
      expect(parseSearchParams('foo=bar')).toEqual({ foo: 'bar' })
    })

    it('converts boolean strings', () => {
      expect(parseSearchParams('active=true')).toEqual({ active: true })
    })

    it('does not convert comma-separated arrays', () => {
      expect(parseSearchParams('ids=1,2,3')).toEqual({ ids: '1,2,3' })
    })

    it('does not convert nested objects (key remains as-is)', () => {
      expect(parseSearchParams('user[name]=john')).toEqual({
        'user[name]': 'john',
      })
    })

    it('serializes object', () => {
      expect(stringifySearchParams({ foo: 'bar' })).toBe('?foo=bar')
    })

    it('serializes arrays as comma-separated', () => {
      expect(stringifySearchParams({ ids: ['1', '2'] })).toBe('?ids=1%2C2')
    })

    it('ignores nested objects', () => {
      expect(
        stringifySearchParams({ foo: 'bar', user: { name: 'john' } }),
      ).toBe('?foo=bar')
    })
  })

  describe('custom feature combinations', () => {
    it('disables only boolean conversion', () => {
      const { parseSearchParams } = createSerializer({ booleanStrings: false })
      expect(parseSearchParams('active=true')).toEqual({ active: 'true' })
    })

    it('disables only comma-separated arrays', () => {
      const { parseSearchParams } = createSerializer({
        commaSeparatedArrays: false,
      })
      expect(parseSearchParams('ids=1,2,3')).toEqual({ ids: '1,2,3' })
    })

    it('disables only nesting', () => {
      const { parseSearchParams } = createSerializer({ nestedObjects: false })
      expect(parseSearchParams('user[name]=john')).toEqual({
        'user[name]': 'john',
      })
    })

    it('disables only duplicate key arrays', () => {
      const { parseSearchParams } = createSerializer({
        duplicateKeyArrays: false,
      })
      // Even with duplicate keys, only first value is used (URLSearchParams behavior)
      const result = parseSearchParams('id=1&id=2')
      expect(result.id).toBe('1')
    })
  })

  describe('preset constants', () => {
    it('FULL_FEATURES enables all features', () => {
      expect(FULL_FEATURES).toEqual({
        commaSeparatedArrays: true,
        booleanStrings: true,
        nestedObjects: true,
        phpArrays: true,
        duplicateKeyArrays: true,
        numericIndexArrays: true,
      })
    })

    it('SIMPLE_FEATURES enables only boolean conversion', () => {
      expect(SIMPLE_FEATURES).toEqual({
        commaSeparatedArrays: false,
        booleanStrings: true,
        nestedObjects: false,
        phpArrays: false,
        duplicateKeyArrays: false,
        numericIndexArrays: false,
      })
    })
  })
})
