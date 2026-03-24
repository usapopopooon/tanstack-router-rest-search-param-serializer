import { z } from 'zod'

/**
 * Create a Zod schema for comma-separated arrays
 *
 * Converts values parsed by the REST-compliant serializer into z.array()-compatible form.
 * - Empty string `''` → empty array `[]`
 * - Single string `'a'` → single-element array `['a']`
 *
 * @example
 * const schema = z.object({
 *   ids: commaSeparatedArray(z.string()).optional(),
 * })
 *
 * schema.parse({ ids: '' })      // { ids: [] }
 * schema.parse({ ids: '1' })     // { ids: ['1'] }
 * schema.parse({ ids: ['1'] })   // { ids: ['1'] }
 */
export const commaSeparatedArray = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.preprocess((val) => {
    if (val === '') return []
    if (typeof val === 'string') return [val]
    return val
  }, z.array(itemSchema))
