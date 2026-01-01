/**
 * Set value in nested object (immutable)
 *
 * Set a value in an object based on a key path
 * Does not include numericIndexArrays processing (pure object nesting only)
 *
 * @example
 * setNestedValue({}, ['user', 'name'], 'john')
 * // { user: { name: 'john' } }
 */

/**
 * Set a value in an object based on a nested key path (immutable)
 *
 * @param obj Target object
 * @param keys Array of keys (result of parseNestedKey)
 * @param value Value to set
 * @param options Options
 * @returns New object
 */
export const setNestedValue = (
  obj: { [key: string]: unknown },
  keys: string[],
  value: string,
  options: { numericIndexArrays?: boolean } = { numericIndexArrays: true },
): { [key: string]: unknown } => {
  if (keys.length === 0) {
    return obj
  }

  const [firstKey, ...restKeys] = keys

  // If reached the last key
  if (restKeys.length === 0) {
    return { ...obj, [firstKey]: value }
  }

  // Check next key
  const nextKey = restKeys[0]

  // Get current value
  const currentValue = obj[firstKey]

  // Add to array for empty brackets [] (PHP-style)
  if (restKeys.length === 1 && nextKey === '') {
    const existingArray = Array.isArray(currentValue) ? currentValue : []
    return { ...obj, [firstKey]: [...existingArray, value] }
  }

  // For numeric index (controlled by option)
  if (options.numericIndexArrays && /^\d+$/.test(nextKey)) {
    const index = parseInt(nextKey, 10)
    const existingArray = Array.isArray(currentValue) ? currentValue : []

    // Recurse if there are remaining keys
    const newItem =
      restKeys.length > 1
        ? setNestedValue(
            typeof existingArray[index] === 'object' &&
              existingArray[index] !== null
              ? (existingArray[index] as { [key: string]: unknown })
              : {},
            restKeys.slice(1),
            value,
            options,
          )
        : value

    // Create new array (immutable)
    const newArray =
      index >= existingArray.length
        ? Array.from({ length: index + 1 }, (_, i) =>
            i === index ? newItem : existingArray[i],
          )
        : existingArray.map((item, i) => (i === index ? newItem : item))

    return { ...obj, [firstKey]: newArray }
  }

  // Recurse as object
  const existingObj =
    typeof currentValue === 'object' &&
    currentValue !== null &&
    !Array.isArray(currentValue)
      ? (currentValue as { [key: string]: unknown })
      : {}

  return {
    ...obj,
    [firstKey]: setNestedValue(existingObj, restKeys, value, options),
  }
}
