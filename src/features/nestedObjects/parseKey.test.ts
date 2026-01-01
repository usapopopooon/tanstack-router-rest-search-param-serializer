import { describe, expect, it } from 'vitest'

import { isNestedKey, parseNestedKey } from './parseKey'

describe('parseKey', () => {
  describe('isNestedKey', () => {
    it('returns true for key containing brackets', () => {
      expect(isNestedKey('user[name]')).toBe(true)
    })

    it('returns false for key without brackets', () => {
      expect(isNestedKey('name')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isNestedKey('')).toBe(false)
    })
  })

  describe('parseNestedKey', () => {
    describe('simple keys', () => {
      it('returns key without brackets as single-element array', () => {
        expect(parseNestedKey('name')).toEqual(['name'])
      })

      it('returns array with empty string for empty string', () => {
        expect(parseNestedKey('')).toEqual([''])
      })
    })

    describe('nested object format', () => {
      it('parses user[name] to ["user", "name"]', () => {
        expect(parseNestedKey('user[name]')).toEqual(['user', 'name'])
      })

      it('parses user[address][city] to ["user", "address", "city"]', () => {
        expect(parseNestedKey('user[address][city]')).toEqual([
          'user',
          'address',
          'city',
        ])
      })
    })

    describe('array format', () => {
      it('parses ids[] to ["ids", ""]', () => {
        expect(parseNestedKey('ids[]')).toEqual(['ids', ''])
      })

      it('parses tags[][] to ["tags", "", ""]', () => {
        expect(parseNestedKey('tags[][]')).toEqual(['tags', '', ''])
      })
    })

    describe('numeric index format', () => {
      it('parses items[0] to ["items", "0"]', () => {
        expect(parseNestedKey('items[0]')).toEqual(['items', '0'])
      })

      it('parses items[0][name] to ["items", "0", "name"]', () => {
        expect(parseNestedKey('items[0][name]')).toEqual(['items', '0', 'name'])
      })

      it('parses data[0][items][1][value] correctly', () => {
        expect(parseNestedKey('data[0][items][1][value]')).toEqual([
          'data',
          '0',
          'items',
          '1',
          'value',
        ])
      })
    })

    describe('mixed format', () => {
      it('parses user[tags][] to ["user", "tags", ""]', () => {
        expect(parseNestedKey('user[tags][]')).toEqual(['user', 'tags', ''])
      })

      it('parses users[0][roles][] correctly', () => {
        expect(parseNestedKey('users[0][roles][]')).toEqual([
          'users',
          '0',
          'roles',
          '',
        ])
      })
    })
  })
})
