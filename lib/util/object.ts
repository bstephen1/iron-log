/** Removes undefined keys at the root level.
 * Does not remove nested undefined keys, and does not remove falsy keys
 * like '' or {} */
export const removeUndefinedKeys = <T extends object>(obj: T) =>
  Object.entries(obj).reduce<Record<string, Partial<T>>>(
    (acc, [key, value]) => {
      if (value !== undefined) acc[key] = value
      return acc
    },
    {}
  )
