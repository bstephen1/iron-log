import { v4 as uuid } from 'uuid'
import { ApiError } from '../models/ApiError'
import { Exercise } from '../models/AsyncSelectorOption/Exercise'
import { enqueueSnackbar } from 'notistack'
import { ERRORS } from './frontend/constants'

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
  const map: Index<T> = {}
  arr?.map((cur) => {
    if (typeof cur[index] !== 'string') {
      throw new Error('Index field must be string')
    }

    map[cur[index] as string] = cur
  })
  return map
}

// Fun fact: after naming this, found out mui date picker internals has an identical function.
export const doNothing = () => {}

export const swrFetcher = (url: string) => fetchJson(url)

/** performs a fetch and pulls out the json from the res.
 *  Also checks if the res is an error. Note just calling fetch() by itself
 *  has no inherent error checking!
 */
export const fetchJson = async <T>(...args: Parameters<typeof fetch>) => {
  // note: If the second arg omitted, request defaults to fetch.
  const res = await fetch(...args)
  const json: T | ApiError = await res.json()
  if (res.ok) {
    return json as T
  }

  // the original error details can be viewed in the network tab
  throw new ApiError(res.status, (json as ApiError).message)
}

/** Capitalize first letter of a string.
 *  Mui has an undocumented capitalize() function, but it doesn't work in node env
 *  (eg, running ts script files from command line).   */
export const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)

/** Async partial update, intended for swr mutate(). For non-async type use UpdateState.  */
export type UpdateFields<T> = (changes: Partial<T>) => Promise<void>
/** Partial state update that spreads over previous state. For async type use UpdateFields.  */
export type UpdateState<T> = (changes: Partial<T>) => void

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
  Object.entries(obj).reduce<Partial<T>>(
    (prev, [key, value]) =>
      value !== undefined ? { ...prev, [key]: value } : prev,
    {}
  )

/** converts a value that may be a singleton or array into an array */
export const toArray = <T>(value: T | T[] | undefined) =>
  Array.isArray(value) ? value : value ? [value] : []

export const enqueueError = (
  e: unknown,
  /** message to show if the error is a validation error */
  validationMessage: string
) => {
  const originalMessage = e instanceof Error ? e.message : ''

  enqueueSnackbar({
    message:
      originalMessage === ERRORS.validationFail
        ? validationMessage
        : ERRORS.retry,
    severity: 'error',
    persist: true,
  })
}
