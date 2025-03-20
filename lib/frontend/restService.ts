import dayjs, { Dayjs } from 'dayjs'
import { ParsedUrlQueryInput, stringify } from 'querystring'
import useSWR from 'swr'
import { arrayToIndex, fetchJson, fetchJsonNullable } from '../../lib/util'
import { ApiError } from '../../models/ApiError'
import { AsyncSelectorOption } from '../../models/AsyncSelectorOption'
import { Category } from '../../models/AsyncSelectorOption/Category'
import { Exercise } from '../../models/AsyncSelectorOption/Exercise'
import { Modifier } from '../../models/AsyncSelectorOption/Modifier'
import { Bodyweight } from '../../models/Bodyweight'
import { Record } from '../../models/Record'
import { SessionLog } from '../../models/SessionLog'
import BodyweightQuery from '../../models/query-filters/BodyweightQuery'
import DateRangeQuery from '../../models/query-filters/DateRangeQuery'
import { ExerciseQuery } from '../../models/query-filters/ExerciseQuery'
import { RecordQuery } from '../../models/query-filters/RecordQuery'
import {
  DATE_FORMAT,
  URI_BODYWEIGHT,
  URI_CATEGORIES,
  URI_EXERCISES,
  URI_MODIFIERS,
  URI_RECORDS,
  URI_SESSIONS,
} from './constants'

// todo: res.json() breaks if json is null. Have to guard against that.

// Note: make sure any fetch() functions actually return after the fetch!
// Otherwise there's no guarantee the write will be finished before it tries to read again...

/** Parse a Query object into a rest param string. Query objects should be spread into this function. */
export const paramify = (query: ParsedUrlQueryInput) => {
  const parsedQuery: ParsedUrlQueryInput = {}
  // Any empty arrays must be converted into empty strings instead.
  // stringify() just drops empty arrays.
  for (const [key, value] of Object.entries(query)) {
    parsedQuery[key] = Array.isArray(value) && !value.length ? '' : value
  }
  // note that stringify doesn't add the leading '?'.
  // See documentation: https://nodejs.org/api/querystring.html#querystringstringifyobj-sep-eq-options
  return '?' + stringify(parsedQuery)
}

/** Formats an object to a json string, converting any undefined values to null instead.
 *  Undefined is not considered a valid json value, so it gets ignored.
 *
 *  JSON.stringify() should never be used directly outside this function, or updates may not go through
 *  when calling PATCH functions.
 *
 *  Any data fields that may be undefined should also expect "null" as a value.
 */
const toJson = (obj: object) =>
  JSON.stringify(obj, (_, value: unknown) =>
    typeof value === 'undefined' ? null : value
  )

const toNames = (entities?: AsyncSelectorOption[]) =>
  entities?.map((entity) => entity.name) ?? []

const nameSort = <T extends { name: string }>(data?: T[]) =>
  data?.sort((a, b) => a.name.localeCompare(b.name))

//---------
// SESSION
//---------

export function useSessionLog(day: Dayjs | string) {
  const { data, error, isLoading, mutate } = useSWR<
    SessionLog | null,
    ApiError
  >(URI_SESSIONS + (typeof day === 'string' ? day : day.format(DATE_FORMAT)), {
    fetcher: fetchJsonNullable,
  })

  return {
    sessionLog: data,
    isError: !!error,
    isLoading,
    mutate,
  }
}

export function useSessionLogs(query: DateRangeQuery) {
  const { data, error, isLoading, mutate } = useSWR<SessionLog[], ApiError>(
    URI_SESSIONS + paramify({ ...query })
  )

  return {
    sessionLogs: data,
    sessionLogsIndex: arrayToIndex<SessionLog>('date', data),
    isLoading,
    isError: !!error,
    mutate,
  }
}

export async function addSessionLog(session: SessionLog): Promise<SessionLog> {
  return fetchJson(URI_SESSIONS + session.date, {
    method: 'POST',
    body: toJson(session),
    headers: { 'content-type': 'application/json' },
  })
}

export async function updateSessionLog(
  newSesson: SessionLog
): Promise<SessionLog> {
  return fetchJson(URI_SESSIONS + newSesson.date, {
    method: 'PUT',
    body: toJson(newSesson),
    headers: { 'content-type': 'application/json' },
  })
}

export async function deleteSessionRecord(
  date: string,
  recordId: string
): Promise<SessionLog> {
  return fetchJson(`${URI_SESSIONS}${date}/records/${recordId}`, {
    method: 'DELETE',
  })
}

//--------
// RECORD
//--------

/** Note: whenever mutate() is used, any component using useRecord will rerender, even if they don't
 *  use the record from this hook. This can be avoided by lifting the full record to a lightweight parent
 *  component and only passing the fields actually needed as props. If the child needs access to mutate(),
 *  it can either take the mutate from this hook as another prop, or use the global mutate from useSWRConfig().
 *
 *  Note that this applies to any other useSWR hook as well.
 */
export function useRecord(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Record | null, ApiError>(
    URI_RECORDS + id,
    { fetcher: fetchJsonNullable }
  )

  return {
    record: data,
    isError: !!error,
    isLoading,
    // todo: mutate => mutateRecord ? Hard to wrangle with multiple mutates
    mutate,
  }
}

export function useRecords(query?: RecordQuery, shouldFetch = true) {
  const { data, isLoading, error, mutate } = useSWR<Record[], ApiError>(
    shouldFetch ? URI_RECORDS + paramify({ ...query }) : null
  )

  return {
    // data will be undefined forever if the fetch is null
    records: shouldFetch ? data : [],
    recordsIndex: shouldFetch ? arrayToIndex<Record>('_id', data) : {},
    isError: !!error,
    mutate,
    isLoading,
  }
}

export async function addRecord(newRecord: Record): Promise<Record> {
  return fetchJson(URI_RECORDS + newRecord._id, {
    method: 'POST',
    body: toJson(newRecord),
    headers: { 'content-type': 'application/json' },
  })
}

export async function updateRecordFields(
  id: Record['_id'],
  updates: Partial<Record>
): Promise<Record> {
  return fetchJson(URI_RECORDS + id, {
    method: 'PATCH',
    body: toJson(updates),
    headers: { 'content-type': 'application/json' },
  })
}

//----------
// EXERCISE
//----------

export function useExercises(query?: ExerciseQuery) {
  const { data, error, mutate } = useSWR<Exercise[], ApiError>(
    URI_EXERCISES + paramify({ ...query })
  )
  const sortedData = nameSort(data)

  return {
    exercises: sortedData,
    exerciseNames: toNames(sortedData),
    isError: !!error,
    mutate,
  }
}

export function useExercise(id: string | null) {
  // passing null to useSWR disables fetching
  const { data, error, mutate } = useSWR<Exercise | null, ApiError>(
    id ? URI_EXERCISES + id : null,
    { fetcher: fetchJsonNullable }
  )

  return {
    exercise: data,
    isError: !!error,
    mutate,
  }
}

export async function addExercise(newExercise: Exercise): Promise<Exercise> {
  return fetchJson(URI_EXERCISES + newExercise._id, {
    method: 'POST',
    body: toJson(newExercise),
    headers: { 'content-type': 'application/json' },
  })
}

export async function updateExercise(newExercise: Exercise): Promise<Exercise> {
  return fetchJson(URI_EXERCISES + newExercise._id, {
    method: 'PUT',
    body: toJson(newExercise),
    headers: { 'content-type': 'application/json' },
  })
}

export async function updateExerciseFields(
  exercise: Exercise,
  updates: Partial<Exercise>
): Promise<Exercise> {
  return fetchJson(URI_EXERCISES + exercise._id, {
    method: 'PATCH',
    body: toJson(updates),
    headers: { 'content-type': 'application/json' },
  })
}

export async function deleteExercise(id: string): Promise<string> {
  return fetchJson(URI_EXERCISES + id, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
  })
}

//----------
// MODIFIER
//----------

export function useModifiers() {
  const { data, error, mutate } = useSWR<Modifier[], ApiError>(URI_MODIFIERS)
  const sortedData = nameSort(data)

  return {
    modifiers: sortedData,
    modifiersIndex: arrayToIndex<Modifier>('name', data),
    modifierNames: toNames(sortedData),
    isError: !!error,
    mutate,
  }
}

export async function addModifier(newModifier: Modifier): Promise<Modifier> {
  return fetchJson(URI_MODIFIERS + newModifier._id, {
    method: 'POST',
    body: toJson(newModifier),
    headers: { 'content-type': 'application/json' },
  })
}

export async function updateModifierFields(
  modifier: Modifier,
  updates: Partial<Modifier>
): Promise<Modifier> {
  return fetchJson(URI_MODIFIERS + modifier._id, {
    method: 'PATCH',
    body: toJson(updates),
    headers: { 'content-type': 'application/json' },
  })
}

export async function deleteModifier(id: string): Promise<string> {
  return fetchJson(URI_MODIFIERS + id, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
  })
}

//----------
// CATEGORY
//----------

export function useCategories() {
  const { data, error, mutate } = useSWR<Category[], ApiError>(URI_CATEGORIES)
  const sortedData = nameSort(data)

  return {
    categories: sortedData,
    categoryNames: toNames(sortedData),
    isError: !!error,
    mutate,
  }
}

export async function addCategory(newCategory: Category): Promise<Category> {
  return fetchJson(URI_CATEGORIES + newCategory._id, {
    method: 'POST',
    body: toJson(newCategory),
    headers: { 'content-type': 'application/json' },
  })
}

export async function updateCategoryFields(
  category: Category,
  updates: Partial<Category>
): Promise<Category> {
  return fetchJson(URI_CATEGORIES + category._id, {
    method: 'PATCH',
    body: toJson(updates),
    headers: { 'content-type': 'application/json' },
  })
}

export async function deleteCategory(id: string): Promise<string> {
  return fetchJson(URI_CATEGORIES + id, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
  })
}

//------------
// BODYWEIGHT
//------------

export function useBodyweightHistory(
  query?: BodyweightQuery,
  shouldFetch = true
) {
  // bodyweight history is stored as ISO8601, so we need to add a day.
  // 2020-04-02 sorts as less than 2020-04-02T08:02:17-05:00 since there are less chars.
  // Incrementing to 2020-04-03 will catch everything from the previous day.
  const addDay = (date: string) => dayjs(date).add(1, 'day').format(DATE_FORMAT)

  const start = query?.start ? addDay(query.start) : undefined
  const end = query?.end ? addDay(query.end) : undefined

  const { data, error, mutate } = useSWR<Bodyweight[], ApiError>(
    shouldFetch ? URI_BODYWEIGHT + paramify({ start, end, ...query }) : null
  )

  return {
    data: shouldFetch ? data : [],
    isError: !!error,
    mutate,
  }
}

export async function addBodyweight(
  newBodyweight: Bodyweight
): Promise<Bodyweight> {
  return fetchJson(URI_BODYWEIGHT, {
    method: 'POST',
    body: toJson(newBodyweight),
    headers: { 'content-type': 'application/json' },
  })
}

export async function updateBodyweight(
  newBodyweight: Bodyweight
): Promise<Bodyweight> {
  return fetchJson(URI_BODYWEIGHT, {
    method: 'PUT',
    body: toJson(newBodyweight),
    headers: { 'content-type': 'application/json' },
  })
}
