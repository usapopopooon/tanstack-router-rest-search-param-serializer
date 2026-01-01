import { describe, expect, it } from 'vitest'

import { flattenObject } from './flatten'

describe('flatten', () => {
  describe('simple objects', () => {
    it('returns flat object as-is', () => {
      expect(flattenObject({ name: 'john', age: '30' })).toEqual([
        ['name', 'john'],
        ['age', '30'],
      ])
    })

    it('returns empty array for empty object', () => {
      expect(flattenObject({})).toEqual([])
    })

    it('skips undefined/null values', () => {
      expect(flattenObject({ a: '1', b: undefined, c: null, d: '2' })).toEqual([
        ['a', '1'],
        ['d', '2'],
      ])
    })
  })

  describe('primitive value conversion', () => {
    it('converts numbers to strings', () => {
      expect(flattenObject({ count: 42 })).toEqual([['count', '42']])
    })

    it('converts booleans to strings', () => {
      expect(flattenObject({ active: true, deleted: false })).toEqual([
        ['active', 'true'],
        ['deleted', 'false'],
      ])
    })
  })

  describe('nested objects', () => {
    it('expands one level of nesting', () => {
      expect(flattenObject({ user: { name: 'john' } })).toEqual([
        ['user[name]', 'john'],
      ])
    })

    it('expands nested object with multiple properties', () => {
      expect(flattenObject({ user: { name: 'john', age: '30' } })).toEqual([
        ['user[name]', 'john'],
        ['user[age]', '30'],
      ])
    })

    it('expands deeply nested objects', () => {
      expect(flattenObject({ user: { address: { city: 'tokyo' } } })).toEqual([
        ['user[address][city]', 'tokyo'],
      ])
    })
  })

  describe('primitive arrays', () => {
    it('joins string array with comma', () => {
      expect(flattenObject({ ids: ['1', '2', '3'] })).toEqual([
        ['ids', '1,2,3'],
      ])
    })

    it('joins number array with comma', () => {
      expect(flattenObject({ ids: [1, 2, 3] })).toEqual([['ids', '1,2,3']])
    })

    it('converts empty array to empty string', () => {
      expect(flattenObject({ ids: [] })).toEqual([['ids', '']])
    })
  })

  describe('object arrays', () => {
    it('expands array with single object', () => {
      expect(flattenObject({ items: [{ name: 'apple' }] })).toEqual([
        ['items[0][name]', 'apple'],
      ])
    })

    it('expands object array with multiple properties', () => {
      expect(
        flattenObject({ items: [{ name: 'apple', price: '100' }] }),
      ).toEqual([
        ['items[0][name]', 'apple'],
        ['items[0][price]', '100'],
      ])
    })

    it('expands array with multiple objects', () => {
      expect(
        flattenObject({
          items: [
            { name: 'apple', price: '100' },
            { name: 'banana', price: '200' },
          ],
        }),
      ).toEqual([
        ['items[0][name]', 'apple'],
        ['items[0][price]', '100'],
        ['items[1][name]', 'banana'],
        ['items[1][price]', '200'],
      ])
    })
  })

  describe('mixed cases', () => {
    it('expands object with flat, nested, and array properties', () => {
      expect(
        flattenObject({
          name: 'john',
          user: { active: true },
          tags: ['a', 'b'],
        }),
      ).toEqual([
        ['name', 'john'],
        ['user[active]', 'true'],
        ['tags', 'a,b'],
      ])
    })

    it('expands array within nested object', () => {
      expect(
        flattenObject({
          user: { tags: ['admin', 'user'] },
        }),
      ).toEqual([['user[tags]', 'admin,user']])
    })
  })
})
