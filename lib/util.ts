import { v4 as uuid } from 'uuid'
import type { Exercise } from '../models/AsyncSelectorOption/Exercise'

/** Manually create a globally unique id across all tables. This should be used for ALL new records.
 We want to manually handle the IDs so that ID generation is not tied to the specific database being used,
 and to ensure no information is leaked from the ID (eg, userId=55 implies users 1-54 exist)
 */
export const generateId = () => uuid()

// manually have to specify undefined is possible
type Index<T> = { [key: string]: T | undefined }
/** Takes an array of objects which each have a given index field and converts them to an object of objects indexed by the given field.
 * Index field values must be strings
 *
 * eg, indexing on _id: [{_id: '1', data: 'a'}] => {'1': {_id: '1', data: 'a'}}
 */
export const arrayToIndex = <T extends object>(index: keyof T, arr?: T[]) => {
  return arr?.reduce<Index<T>>((acc, cur) => {
    if (typeof cur[index] !== 'string') {
      throw new Error('Index field must be string')
    }

    acc[cur[index]] = cur
    return acc
  }, {})
}

// Fun fact: after naming this, found out mui date picker internals has an identical function.
export const doNothing = () => {}

/** Capitalize first letter of a string.
 *  Mui has an undocumented capitalize() function, but it doesn't work in node env
 *  (eg, running ts script files from command line).   */
export const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)

/** Update some fields of an object, spreading over previous state  */
export type PartialUpdate<T> = (changes: Partial<T>) => void

/** returns the exercises the given category or modifier is used in */
export const getUsage = (
  exercises: Exercise[] | undefined | null,
  field: keyof Pick<Exercise, 'categories' | 'modifiers'>,
  name: string
) => exercises?.filter((exercise) => exercise[field].includes(name)) ?? []

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
