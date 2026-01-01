import { z } from 'zod'

/**
 * Create a Zod schema for comma-separated arrays
 *
 * Since comma-separated format cannot distinguish between empty arrays and empty strings,
 * the REST-compliant serializer parses empty values like `?ids=` as empty string `''`.
 * This helper converts empty strings to empty arrays `[]` for compatibility with z.array() schemas.
 *
 * @example
 * const schema = z.object({
 *   ids: commaSeparatedArray(z.string()).optional(),
 * })
 *
 * schema.parse({ ids: '' })    // { ids: [] }
 * schema.parse({ ids: ['1'] }) // { ids: ['1'] }
 */
export const commaSeparatedArray = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.preprocess((val) => (val === '' ? [] : val), z.array(itemSchema))
