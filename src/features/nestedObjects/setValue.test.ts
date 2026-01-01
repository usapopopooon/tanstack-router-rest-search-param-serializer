import { describe, expect, it } from 'vitest'

import { setNestedValue } from './setValue'

describe('setValue', () => {
  describe('simple keys', () => {
    it('sets value for single key', () => {
      expect(setNestedValue({}, ['name'], 'john')).toEqual({ name: 'john' })
    })

    it('overwrites existing value', () => {
      expect(setNestedValue({ name: 'jane' }, ['name'], 'john')).toEqual({
        name: 'john',
      })
    })

    it('preserves existing properties', () => {
      expect(setNestedValue({ age: '30' }, ['name'], 'john')).toEqual({
        age: '30',
        name: 'john',
      })
    })
  })

  describe('nested objects', () => {
    it('creates nested object using user[name] format', () => {
      expect(setNestedValue({}, ['user', 'name'], 'john')).toEqual({
        user: { name: 'john' },
      })
    })

    it('creates deeply nested object using user[address][city] format', () => {
      expect(setNestedValue({}, ['user', 'address', 'city'], 'tokyo')).toEqual({
        user: { address: { city: 'tokyo' } },
      })
    })

    it('adds to existing nested object', () => {
      const initial = { user: { name: 'john' } }
      expect(setNestedValue(initial, ['user', 'age'], '30')).toEqual({
        user: { name: 'john', age: '30' },
      })
    })
  })

  describe('arrays (empty bracket format)', () => {
    it('creates array using ids[] format', () => {
      expect(setNestedValue({}, ['ids', ''], '1')).toEqual({ ids: ['1'] })
    })

    it('appends to existing array', () => {
      expect(setNestedValue({ ids: ['1'] }, ['ids', ''], '2')).toEqual({
        ids: ['1', '2'],
      })
    })

    it('builds array by adding multiple times', () => {
      const result = ['1', '2', '3'].reduce<{ [key: string]: unknown }>(
        (acc, value) => setNestedValue(acc, ['ids', ''], value),
        {},
      )
      expect(result).toEqual({ ids: ['1', '2', '3'] })
    })
  })

  describe('numeric index format', () => {
    it('creates array using items[0] format', () => {
      expect(setNestedValue({}, ['items', '0'], 'a')).toEqual({ items: ['a'] })
    })

    it('creates sparse array with items[2]', () => {
      expect(setNestedValue({}, ['items', '2'], 'c')).toEqual({
        // eslint-disable-next-line no-sparse-arrays
        items: [, , 'c'],
      })
    })

    it('creates object within array using items[0][name] format', () => {
      expect(setNestedValue({}, ['items', '0', 'name'], 'apple')).toEqual({
        items: [{ name: 'apple' }],
      })
    })

    it('sets multiple properties to object within array', () => {
      const operations: [string[], string][] = [
        [['items', '0', 'name'], 'apple'],
        [['items', '0', 'price'], '100'],
      ]
      const result = operations.reduce<{ [key: string]: unknown }>(
        (acc, [keys, value]) => setNestedValue(acc, keys, value),
        {},
      )
      expect(result).toEqual({
        items: [{ name: 'apple', price: '100' }],
      })
    })

    it('adds multiple objects to array', () => {
      const operations: [string[], string][] = [
        [['items', '0', 'name'], 'apple'],
        [['items', '1', 'name'], 'banana'],
      ]
      const result = operations.reduce<{ [key: string]: unknown }>(
        (acc, [keys, value]) => setNestedValue(acc, keys, value),
        {},
      )
      expect(result).toEqual({
        items: [{ name: 'apple' }, { name: 'banana' }],
      })
    })

    it('ignores numeric index when numericIndexArrays: false', () => {
      expect(
        setNestedValue({}, ['items', '0'], 'a', { numericIndexArrays: false }),
      ).toEqual({ items: { '0': 'a' } })
    })
  })

  describe('mixed format', () => {
    it('creates array within nested object using user[tags][] format', () => {
      const result = ['tag1', 'tag2'].reduce<{ [key: string]: unknown }>(
        (acc, value) => setNestedValue(acc, ['user', 'tags', ''], value),
        {},
      )
      expect(result).toEqual({
        user: { tags: ['tag1', 'tag2'] },
      })
    })

    it('creates array in object within array using users[0][roles][] format', () => {
      const operations: [string[], string][] = [
        [['users', '0', 'name'], 'john'],
        [['users', '0', 'roles', ''], 'admin'],
        [['users', '0', 'roles', ''], 'user'],
      ]
      const result = operations.reduce<{ [key: string]: unknown }>(
        (acc, [keys, value]) => setNestedValue(acc, keys, value),
        {},
      )
      expect(result).toEqual({
        users: [{ name: 'john', roles: ['admin', 'user'] }],
      })
    })
  })

  describe('edge cases', () => {
    it('returns original object for empty key array', () => {
      const obj = { a: '1' }
      expect(setNestedValue(obj, [], 'value')).toEqual(obj)
    })

    it('overwrites non-object existing value with object', () => {
      expect(setNestedValue({ user: 'old' }, ['user', 'name'], 'john')).toEqual(
        {
          user: { name: 'john' },
        },
      )
    })

    it('overwrites non-array existing value with array', () => {
      expect(setNestedValue({ ids: 'old' }, ['ids', '0'], '1')).toEqual({
        ids: ['1'],
      })
    })
  })
})
