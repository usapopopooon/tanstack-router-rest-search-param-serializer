import { describe, expect, it } from 'vitest'

import {
  aggregatePhpArrayEntries,
  expandToPhpArrayPairs,
  getPhpArrayBaseKey,
  isPhpArrayKey,
} from './phpArrays'

describe('phpArrays', () => {
  describe('isPhpArrayKey', () => {
    it('identifies PHP-style array key', () => {
      expect(isPhpArrayKey('ids[]')).toBe(true)
    })

    it('returns false for regular key', () => {
      expect(isPhpArrayKey('ids')).toBe(false)
    })

    it('returns false for Rails-style nested key', () => {
      expect(isPhpArrayKey('user[name]')).toBe(false)
    })

    it('returns false for numeric index format', () => {
      expect(isPhpArrayKey('items[0]')).toBe(false)
    })

    it('returns false for PHP-style within nesting (only simple PHP-style is targeted)', () => {
      expect(isPhpArrayKey('user[tags][]')).toBe(false)
    })
  })

  describe('getPhpArrayBaseKey', () => {
    it('extracts base key from PHP-style key', () => {
      expect(getPhpArrayBaseKey('ids[]')).toBe('ids')
    })

    it('returns regular key as-is', () => {
      expect(getPhpArrayBaseKey('ids')).toBe('ids')
    })

    it('removes only trailing []', () => {
      expect(getPhpArrayBaseKey('tags[]')).toBe('tags')
    })
  })

  describe('expandToPhpArrayPairs', () => {
    it('expands string array into PHP-style pairs', () => {
      expect(expandToPhpArrayPairs('ids', ['1', '2', '3'])).toEqual([
        ['ids[]', '1'],
        ['ids[]', '2'],
        ['ids[]', '3'],
      ])
    })

    it('converts number array to strings and expands into pairs', () => {
      expect(expandToPhpArrayPairs('ids', [1, 2, 3])).toEqual([
        ['ids[]', '1'],
        ['ids[]', '2'],
        ['ids[]', '3'],
      ])
    })

    it('converts boolean array to strings and expands into pairs', () => {
      expect(expandToPhpArrayPairs('flags', [true, false])).toEqual([
        ['flags[]', 'true'],
        ['flags[]', 'false'],
      ])
    })

    it('returns empty pair array for empty array', () => {
      expect(expandToPhpArrayPairs('ids', [])).toEqual([])
    })

    it('returns pair array even for single element', () => {
      expect(expandToPhpArrayPairs('ids', ['1'])).toEqual([['ids[]', '1']])
    })
  })

  describe('aggregatePhpArrayEntries', () => {
    it('aggregates PHP-style entries into array', () => {
      const entries: [string, string][] = [
        ['ids[]', '1'],
        ['ids[]', '2'],
        ['ids[]', '3'],
      ]
      expect(aggregatePhpArrayEntries(entries)).toEqual({
        ids: ['1', '2', '3'],
      })
    })

    it('keeps regular entries as-is', () => {
      const entries: [string, string][] = [
        ['name', 'john'],
        ['age', '30'],
      ]
      expect(aggregatePhpArrayEntries(entries)).toEqual({
        name: 'john',
        age: '30',
      })
    })

    it('handles mixed PHP-style and regular entries', () => {
      const entries: [string, string][] = [
        ['name', 'john'],
        ['ids[]', '1'],
        ['ids[]', '2'],
        ['active', 'true'],
      ]
      expect(aggregatePhpArrayEntries(entries)).toEqual({
        name: 'john',
        ids: ['1', '2'],
        active: 'true',
      })
    })

    it('aggregates duplicate regular keys as array', () => {
      const entries: [string, string][] = [
        ['id', '1'],
        ['id', '2'],
      ]
      expect(aggregatePhpArrayEntries(entries)).toEqual({
        id: ['1', '2'],
      })
    })

    it('returns empty object for empty iterable', () => {
      expect(aggregatePhpArrayEntries([])).toEqual({})
    })

    it('returns array even for single PHP-style entry', () => {
      const entries: [string, string][] = [['ids[]', '1']]
      expect(aggregatePhpArrayEntries(entries)).toEqual({
        ids: ['1'],
      })
    })
  })
})
