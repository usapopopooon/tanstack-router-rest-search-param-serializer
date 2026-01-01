import { z } from 'zod'

/**
 * Create a Zod schema to join comma-separated arrays back into a string
 *
 * Use when the serializer has converted comma-separated values to an array,
 * but you want certain parameters to remain as strings containing commas.
 *
 * @example
 * const schema = z.object({
 *   // Treat as comma-separated array (default behavior)
 *   ids: z.array(z.string()).optional(),
 *
 *   // Keep as string containing commas
 *   freeText: joinCommaArray(z.string()).optional(),
 * })
 *
 * schema.parse({ freeText: ['a', 'b', 'c'] }) // { freeText: 'a,b,c' }
 * schema.parse({ freeText: 'abc' })           // { freeText: 'abc' }
 */
export const joinCommaArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (Array.isArray(val) ? val.join(',') : val), schema)
