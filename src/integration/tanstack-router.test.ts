import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { createSerializer, parseSearchParams, stringifySearchParams } from '..'
import { commaSeparatedArray } from '../zod-helpers'

/**
 * Integration tests for TanStack Router compatibility
 *
 * These tests verify that the serializer works correctly with TanStack Router's
 * parseSearch, stringifySearch, and validateSearch interfaces.
 */
describe('TanStack Router Integration', () => {
  describe('createRouter parseSearch/stringifySearch interface', () => {
    it('parseSearch receives query string and returns object', () => {
      // TanStack Router calls parseSearch with the query string (without ?)
      const queryString = 'foo=bar&count=123'
      const result = parseSearchParams(queryString)

      expect(result).toEqual({ foo: 'bar', count: '123' })
    })

    it('stringifySearch receives object and returns query string with ?', () => {
      // TanStack Router expects stringifySearch to return string starting with ?
      const searchParams = { foo: 'bar', count: 123 }
      const result = stringifySearchParams(searchParams)

      expect(result).toBe('?foo=bar&count=123')
    })

    it('round trip: stringify then parse preserves data structure', () => {
      const original = {
        q: 'hello',
        tags: ['react', 'typescript'],
        active: true,
        user: { name: 'john' },
      }

      const stringified = stringifySearchParams(original)
      // Remove leading ? for parsing (as TanStack Router does internally)
      const parsed = parseSearchParams(stringified.slice(1))

      expect(parsed).toEqual(original)
    })

    it('handles empty search params', () => {
      expect(parseSearchParams('')).toEqual({})
      expect(stringifySearchParams({})).toBe('')
    })

    it('handles URL with leading ?', () => {
      // parseSearch should handle both with and without leading ?
      expect(parseSearchParams('?foo=bar')).toEqual({ foo: 'bar' })
      expect(parseSearchParams('foo=bar')).toEqual({ foo: 'bar' })
    })
  })

  describe('validateSearch with Zod schema', () => {
    it('validates and transforms simple schema', () => {
      const schema = z.object({
        q: z.string().optional(),
        page: z.coerce.number().default(1),
        active: z.boolean().optional(),
      })

      const queryString = 'q=hello&page=2&active=true'
      const parsed = parseSearchParams(queryString)
      const validated = schema.parse(parsed)

      expect(validated).toEqual({
        q: 'hello',
        page: 2,
        active: true,
      })
    })

    it('validates comma-separated arrays with commaSeparatedArray helper', () => {
      const schema = z.object({
        tags: commaSeparatedArray(z.string()).optional(),
        ids: commaSeparatedArray(z.coerce.number()).optional(),
      })

      const queryString = 'tags=react,typescript,vitest&ids=1,2,3'
      const parsed = parseSearchParams(queryString)
      const validated = schema.parse(parsed)

      expect(validated).toEqual({
        tags: ['react', 'typescript', 'vitest'],
        ids: [1, 2, 3],
      })
    })

    it('handles empty comma-separated arrays with helper', () => {
      const schema = z.object({
        tags: commaSeparatedArray(z.string()).optional(),
      })

      // Empty value becomes empty string, helper converts to empty array
      const queryString = 'tags='
      const parsed = parseSearchParams(queryString)
      const validated = schema.parse(parsed)

      expect(validated).toEqual({
        tags: [],
      })
    })

    it('validates nested objects', () => {
      const schema = z.object({
        filter: z
          .object({
            status: z.string().optional(),
            category: z.string().optional(),
          })
          .optional(),
      })

      const queryString = 'filter[status]=active&filter[category]=books'
      const parsed = parseSearchParams(queryString)
      const validated = schema.parse(parsed)

      expect(validated).toEqual({
        filter: {
          status: 'active',
          category: 'books',
        },
      })
    })

    it('applies default values for missing params', () => {
      const schema = z.object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
        sort: z.string().default('created_at'),
      })

      const parsed = parseSearchParams('')
      const validated = schema.parse(parsed)

      expect(validated).toEqual({
        page: 1,
        limit: 10,
        sort: 'created_at',
      })
    })

    it('validates PHP-style arrays', () => {
      const schema = z.object({
        ids: z.array(z.string()),
      })

      const queryString = 'ids[]=1&ids[]=2&ids[]=3'
      const parsed = parseSearchParams(queryString)
      const validated = schema.parse(parsed)

      expect(validated).toEqual({
        ids: ['1', '2', '3'],
      })
    })

    it('validates duplicate key arrays', () => {
      const schema = z.object({
        ids: z.array(z.string()),
      })

      const queryString = 'ids=1&ids=2&ids=3'
      const parsed = parseSearchParams(queryString)
      const validated = schema.parse(parsed)

      expect(validated).toEqual({
        ids: ['1', '2', '3'],
      })
    })

    it('validates numeric index arrays with objects', () => {
      const schema = z.object({
        items: z.array(
          z.object({
            name: z.string(),
            price: z.coerce.number().optional(),
          }),
        ),
      })

      const queryString =
        'items[0][name]=apple&items[0][price]=100&items[1][name]=banana&items[1][price]=200'
      const parsed = parseSearchParams(queryString)
      const validated = schema.parse(parsed)

      expect(validated).toEqual({
        items: [
          { name: 'apple', price: 100 },
          { name: 'banana', price: 200 },
        ],
      })
    })
  })

  describe('custom serializer with TanStack Router', () => {
    it('SIMPLE_FEATURES works with basic schema', () => {
      const { parseSearchParams: parse, stringifySearchParams: stringify } =
        createSerializer({
          commaSeparatedArrays: false,
          booleanStrings: true,
          nestedObjects: false,
          phpArrays: false,
          duplicateKeyArrays: false,
          numericIndexArrays: false,
        })

      const schema = z.object({
        q: z.string().optional(),
        active: z.boolean().optional(),
      })

      const queryString = 'q=hello&active=true'
      const parsed = parse(queryString)
      const validated = schema.parse(parsed)

      expect(validated).toEqual({
        q: 'hello',
        active: true,
      })

      // Stringify back
      const stringified = stringify(validated)
      expect(stringified).toBe('?q=hello&active=true')
    })

    it('custom features work correctly', () => {
      const { parseSearchParams: parse } = createSerializer({
        commaSeparatedArrays: true,
        booleanStrings: true,
        nestedObjects: false, // Disable nested objects
        phpArrays: false,
        duplicateKeyArrays: true,
        numericIndexArrays: false,
      })

      // Nested key should be kept as-is when nestedObjects is disabled
      const queryString = 'user[name]=john&active=true'
      const parsed = parse(queryString)

      expect(parsed).toEqual({
        'user[name]': 'john',
        active: true,
      })
    })
  })

  describe('real-world use cases', () => {
    it('search page with filters', () => {
      const searchSchema = z.object({
        q: z.string().optional(),
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(20),
        sort: z.enum(['newest', 'oldest', 'popular']).default('newest'),
        categories: commaSeparatedArray(z.string()).optional(),
        priceRange: z
          .object({
            min: z.coerce.number().optional(),
            max: z.coerce.number().optional(),
          })
          .optional(),
        inStock: z.boolean().optional(),
      })

      const queryString =
        'q=laptop&page=2&limit=50&sort=popular&categories=electronics,computers&priceRange[min]=100&priceRange[max]=2000&inStock=true'
      const parsed = parseSearchParams(queryString)
      const validated = searchSchema.parse(parsed)

      expect(validated).toEqual({
        q: 'laptop',
        page: 2,
        limit: 50,
        sort: 'popular',
        categories: ['electronics', 'computers'],
        priceRange: { min: 100, max: 2000 },
        inStock: true,
      })

      // Round trip
      const stringified = stringifySearchParams(validated)
      const parsedAgain = parseSearchParams(stringified.slice(1))
      const revalidated = searchSchema.parse(parsedAgain)

      expect(revalidated).toEqual(validated)
    })

    it('user list with complex filters', () => {
      const userListSchema = z.object({
        search: z.string().optional(),
        roles: commaSeparatedArray(z.string()).optional(),
        status: z.enum(['active', 'inactive', 'pending']).optional(),
        createdAfter: z.string().optional(),
        createdBefore: z.string().optional(),
        orderBy: z
          .object({
            field: z.string(),
            direction: z.enum(['asc', 'desc']).default('asc'),
          })
          .optional(),
      })

      const queryString =
        'search=john&roles=admin,editor&status=active&orderBy[field]=name&orderBy[direction]=desc'
      const parsed = parseSearchParams(queryString)
      const validated = userListSchema.parse(parsed)

      expect(validated).toEqual({
        search: 'john',
        roles: ['admin', 'editor'],
        status: 'active',
        orderBy: { field: 'name', direction: 'desc' },
      })
    })
  })
})
