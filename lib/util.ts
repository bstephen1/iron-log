import dayjs from 'dayjs'
import { v4 as uuid, validate, version } from 'uuid'
import { ApiError } from '../models/ApiError'
import { Exercise } from '../models/AsyncSelectorOption/Exercise'
import { SetType } from '../models/Record'
import { DB_UNITS, Set, Units } from '../models/Set'
import { DATE_FORMAT } from './frontend/constants'

/** Manually create a globally unique id across all tables. This should be used for ALL new records.
 We want to manually handle the IDs so that ID generation is not tied to the specific database being used,
 and to ensure no information is leaked from the ID (eg, userId=55 implies users 1-54 exist)
 */
export const generateId = () => uuid()

/** Currently enforcing that UUIDs are v4 but that may not be particularly useful.
 v4 is total random generation instead of using time / hardware to generate the uuid.
 */
export const isValidId = (id: string) => validate(id) && version(id) === 4

// manually have to specify undefined is possible
export type Index<T> = { [key: string]: T | undefined }
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

export const dayjsStringAdd = (
  date: string,
  value: number,
  unit?: dayjs.ManipulateType
) => dayjs(date).add(value, unit).format(DATE_FORMAT)

// Fun fact: after naming this, found out mui date picker internals has an identical function.
export const doNothing = () => {}

export const swrFetcher = (url: string) => fetchJson(url)

/** performs a fetch and pulls out the json from the res.
 *  Also checks if the res is an error. Note just calling fetch() by itself
 *  has no inherent error checking!
 */
export const fetchJson = async <T>(...params: Parameters<typeof fetch>) => {
  const res = await fetch(...params)
  const json: T | ApiError = await res.json()
  if (res.ok) {
    return json as T
  }

  const error = json as ApiError
  throw new ApiError(res.status, error.message, error.details)
}

/** The api will throw a 404 error if the requested resource is not found.
 *  This function will ignore 404 errors and pass along null values.
 *  It should only be used if null values are expected (typically for
 *  a useSwr request of a single item, which assumes not found will
 *  return null).)
 */
export const fetchJsonNullable = async <T>(
  ...params: Parameters<typeof fetchJson>
) => {
  try {
    return await fetchJson<T>(...params)
  } catch (e) {
    if (e instanceof ApiError && e.statusCode === 404) {
      return null
    }
    throw e
  }
}

/** Capitalize first letter of a string.
 *  Mui has an undocumented capitalize() function, but it doesn't work in node env
 *  (eg, running ts script files from command line).   */
export const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)

/** Async partial update, intended for swr mutate(). For non-async type use UpdateState.  */
export type UpdateFields<T> = (changes: Partial<T>) => Promise<void>
/** Partial state update that spreads over previous state. For async type use UpdateFields.  */
export type UpdateState<T> = (changes: Partial<T>) => void

/** Returns total reps over all sets when operator is "total", otherwise zero. */
export const calculateTotalReps = (
  sets: Set[],
  { field, operator }: SetType
) => {
  return operator === 'total'
    ? sets.reduce((total, set) => total + Number(set[field] ?? 0), 0)
    : 0
}

/** returns the exercises the given category or modifier is used in */
export const getUsage = (
  exercises: Exercise[] | undefined | null,
  // would rather not hardcode these but unable to pull the keys from Exercise using keyof
  field: 'categories' | 'modifiers',
  name: string
) => exercises?.filter((exercise) => exercise[field].includes(name)) ?? []

export function stringifySetType(
  { operator, min = 0, max = 0, value = 0, field }: SetType,
  units?: Units
) {
  return `${operator} ${
    operator === 'between' ? min + ' and ' + max : value
  } ${(units ?? DB_UNITS)[field]}`
}
