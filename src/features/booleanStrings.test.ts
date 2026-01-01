import { describe, expect, it } from 'vitest'

import {
  isBooleanString,
  parseBooleanString,
  stringifyBoolean,
} from './booleanStrings'

describe('booleanStrings', () => {
  describe('isBooleanString', () => {
    it('returns true for "true"', () => {
      expect(isBooleanString('true')).toBe(true)
    })

    it('returns true for "false"', () => {
      expect(isBooleanString('false')).toBe(true)
    })

    it('returns false for other strings', () => {
      expect(isBooleanString('yes')).toBe(false)
      expect(isBooleanString('no')).toBe(false)
      expect(isBooleanString('')).toBe(false)
    })
  })

  describe('parseBooleanString', () => {
    it('converts "true" to true', () => {
      expect(parseBooleanString('true')).toBe(true)
    })

    it('converts "false" to false', () => {
      expect(parseBooleanString('false')).toBe(false)
    })

    it('returns regular strings as-is', () => {
      expect(parseBooleanString('hello')).toBe('hello')
    })

    it('returns numeric strings as-is', () => {
      expect(parseBooleanString('123')).toBe('123')
    })

    it('returns strings containing "true" as-is (does not convert unless exact match)', () => {
      expect(parseBooleanString('trueValue')).toBe('trueValue')
    })

    it('returns strings containing "false" as-is (does not convert unless exact match)', () => {
      expect(parseBooleanString('falseFlag')).toBe('falseFlag')
    })
  })

  describe('stringifyBoolean', () => {
    it('converts true to string', () => {
      expect(stringifyBoolean(true)).toBe('true')
    })

    it('converts false to string', () => {
      expect(stringifyBoolean(false)).toBe('false')
    })
  })
})
