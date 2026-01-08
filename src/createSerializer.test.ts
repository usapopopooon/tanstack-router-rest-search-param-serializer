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

    it('enables jsonFallback for backward compatibility', () => {
      const { parseSearchParams } = createSerializer({
        jsonFallback: true,
      })
      // JSON array from TanStack Router default
      expect(parseSearchParams('ids=%5B%221%22%2C%222%22%5D')).toEqual({
        ids: ['1', '2'],
      })
      // JSON string from TanStack Router default
      expect(parseSearchParams('code=%22123%22')).toEqual({
        code: '123',
      })
      // JSON object from TanStack Router default
      expect(parseSearchParams('user=%7B%22name%22%3A%22john%22%7D')).toEqual({
        user: { name: 'john' },
      })
    })

    it('does not parse JSON when jsonFallback is disabled (default)', () => {
      const { parseSearchParams } = createSerializer()
      // JSON values are treated as regular strings with comma separation
      const result = parseSearchParams('ids=%5B%221%22%2C%222%22%5D')
      // ["1","2"] is split by comma into ['["1"', '"2"]']
      expect(result.ids).toEqual(['["1"', '"2"]'])
    })

    it('jsonFallback handles mixed REST and JSON format params', () => {
      const { parseSearchParams } = createSerializer({
        jsonFallback: true,
      })
      // Mix of REST format and JSON format
      const result = parseSearchParams(
        'name=john&tags=%5B%22a%22%2C%22b%22%5D&active=true',
      )
      expect(result).toEqual({
        name: 'john',
        tags: ['a', 'b'],
        active: true,
      })
    })

    it('jsonFallback with nested objects parses JSON within nested structure', () => {
      const { parseSearchParams } = createSerializer({
        jsonFallback: true,
        nestedObjects: true,
      })
      // Nested object with JSON value
      const result = parseSearchParams(
        'filter[ids]=%5B%221%22%2C%222%22%5D&filter[name]=test',
      )
      expect(result).toEqual({
        filter: {
          ids: ['1', '2'],
          name: 'test',
        },
      })
    })

    it('jsonFallback handles invalid JSON gracefully', () => {
      const { parseSearchParams } = createSerializer({
        jsonFallback: true,
      })
      // Invalid JSON should be treated as regular string
      const result = parseSearchParams('data=%5Binvalid')
      expect(result.data).toBe('[invalid')
    })

    it('jsonFallback parses JSON boolean values', () => {
      const { parseSearchParams } = createSerializer({
        jsonFallback: true,
        booleanStrings: false, // Disable boolean string conversion
      })
      // JSON true/false are different from string "true"/"false"
      // With jsonFallback, "true" (JSON string) should be parsed as string 'true'
      const result = parseSearchParams('flag=%22true%22')
      expect(result.flag).toBe('true')
    })

    it('jsonFallback takes precedence over comma-separated arrays', () => {
      const { parseSearchParams } = createSerializer({
        jsonFallback: true,
        commaSeparatedArrays: true,
      })
      // JSON array should be parsed as JSON, not split by comma
      const result = parseSearchParams('ids=%5B%221%22%2C%222%22%5D')
      expect(result.ids).toEqual(['1', '2'])
    })
  })

  describe('preset constants', () => {
    it('FULL_FEATURES enables all features except jsonFallback', () => {
      expect(FULL_FEATURES).toEqual({
        commaSeparatedArrays: true,
        booleanStrings: true,
        nestedObjects: true,
        phpArrays: true,
        duplicateKeyArrays: true,
        numericIndexArrays: true,
        jsonFallback: false,
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
        jsonFallback: false,
      })
    })
  })
})
