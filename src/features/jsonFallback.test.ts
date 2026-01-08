import { describe, it, expect } from 'vitest'
import { tryParseJsonValue, isJsonEncodedValue } from './jsonFallback'

describe('jsonFallback', () => {
  describe('tryParseJsonValue', () => {
    describe('JSON arrays', () => {
      it('parses JSON array of strings', () => {
        expect(tryParseJsonValue('["1","2","3"]')).toEqual(['1', '2', '3'])
      })

      it('parses JSON array of numbers', () => {
        expect(tryParseJsonValue('[1,2,3]')).toEqual([1, 2, 3])
      })

      it('parses empty JSON array', () => {
        expect(tryParseJsonValue('[]')).toEqual([])
      })

      it('returns original value for invalid JSON array', () => {
        expect(tryParseJsonValue('[invalid')).toBe('[invalid')
        expect(tryParseJsonValue('[1,2,]')).toBe('[1,2,]')
      })
    })

    describe('JSON strings', () => {
      it('parses JSON string', () => {
        expect(tryParseJsonValue('"123"')).toBe('123')
      })

      it('parses JSON string with spaces', () => {
        expect(tryParseJsonValue('"hello world"')).toBe('hello world')
      })

      it('parses empty JSON string', () => {
        expect(tryParseJsonValue('""')).toBe('')
      })

      it('returns original value for invalid JSON string', () => {
        expect(tryParseJsonValue('"unclosed')).toBe('"unclosed')
      })
    })

    describe('JSON objects', () => {
      it('parses JSON object', () => {
        expect(tryParseJsonValue('{"name":"john"}')).toEqual({ name: 'john' })
      })

      it('parses nested JSON object', () => {
        expect(tryParseJsonValue('{"user":{"name":"john"}}')).toEqual({
          user: { name: 'john' },
        })
      })

      it('parses empty JSON object', () => {
        expect(tryParseJsonValue('{}')).toEqual({})
      })

      it('returns original value for invalid JSON object', () => {
        expect(tryParseJsonValue('{invalid')).toBe('{invalid')
        expect(tryParseJsonValue('{name:john}')).toBe('{name:john}')
      })
    })

    describe('non-JSON values', () => {
      it('returns regular string as-is', () => {
        expect(tryParseJsonValue('hello')).toBe('hello')
      })

      it('returns number string as-is', () => {
        expect(tryParseJsonValue('123')).toBe('123')
      })

      it('returns boolean string as-is', () => {
        expect(tryParseJsonValue('true')).toBe('true')
      })

      it('returns empty string as-is', () => {
        expect(tryParseJsonValue('')).toBe('')
      })
    })
  })

  describe('isJsonEncodedValue', () => {
    it('returns true for JSON array', () => {
      expect(isJsonEncodedValue('["1","2"]')).toBe(true)
      expect(isJsonEncodedValue('[]')).toBe(true)
    })

    it('returns true for JSON string', () => {
      expect(isJsonEncodedValue('"123"')).toBe(true)
      expect(isJsonEncodedValue('""')).toBe(true)
    })

    it('returns true for JSON object', () => {
      expect(isJsonEncodedValue('{"name":"john"}')).toBe(true)
      expect(isJsonEncodedValue('{}')).toBe(true)
    })

    it('returns false for regular values', () => {
      expect(isJsonEncodedValue('hello')).toBe(false)
      expect(isJsonEncodedValue('123')).toBe(false)
      expect(isJsonEncodedValue('true')).toBe(false)
      expect(isJsonEncodedValue('')).toBe(false)
    })

    it('returns false for partial matches', () => {
      expect(isJsonEncodedValue('[unclosed')).toBe(false)
      expect(isJsonEncodedValue('"unclosed')).toBe(false)
      expect(isJsonEncodedValue('{unclosed')).toBe(false)
    })
  })
})
