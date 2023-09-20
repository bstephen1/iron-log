import dayjs, { Dayjs } from 'dayjs'
import { arrayToIndex, fetchJson } from 'lib/util'
import Bodyweight from 'models/Bodyweight'
import Category from 'models/Category'
import Exercise from 'models/Exercise'
import Modifier from 'models/Modifier'
import BodyweightQuery from 'models/query-filters/BodyweightQuery'
import DateRangeQuery from 'models/query-filters/DateRangeQuery'
import { ExerciseQuery } from 'models/query-filters/ExerciseQuery'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import Record from 'models/Record'
import SessionLog from 'models/SessionLog'
import { ParsedUrlQueryInput, stringify } from 'querystring'
import useSWR, { SWRConfiguration } from 'swr'
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

// todo: querystring's stringify is a bit sloppy when fields are undefined.
// eg, {reps: undefined} => 'reps=&'. It doesn't affect the backend call though because
// the validator filters that out. Might be ok to leave as is.
// Also, note that stringify doesn't add the leading '?'.
// See documentation: https://nodejs.org/api/querystring.html#querystringstringifyobj-sep-eq-options

/** Parse a Query object into a rest param string. Query objects should be spread into this function. */
export const paramify = (query: ParsedUrlQueryInput) => '?' + stringify(query)

/** Formats an object to a json string, converting any undefined values to null instead.
 *  Undefined is not considered a valid json value, so it gets ignored.
 *
 *  JSON.stringify() should never be used directly outside this function, or updates may not go through
 *  when calling PATCH functions.
 *
 *  Any data fields that may be undefined should also expect "null" as a value.
 */
const toJson = (obj: Object) =>
  JSON.stringify(obj, (_, value) =>
    typeof value === 'undefined' ? null : value
  )

//---------
// SESSION
//---------

/** An initial value must be provided to this function, which ensures the return will never be undefined due to fetch time */
export function useSessionLogWithInit(
  date: string,
  initialSessionLog: SessionLog | null
) {
  const res = useSessionLog(date, {
    fallbackData: initialSessionLog,
  })

  return {
    ...res,
    sessionLog: res.sessionLog as SessionLog | null,
  }
}

export function useSessionLog(date: Dayjs | string, config?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<SessionLog | null>(
    URI_SESSIONS + (typeof date === 'string' ? date : date.format(DATE_FORMAT)),
    config
  )

  return {
    sessionLog: data,
    isError: !!error,
    isLoading,
    mutate,
  }
}

export function useSessionLogs(query: DateRangeQuery) {
  const { data, error, isLoading, mutate } = useSWR<SessionLog[]>(
    URI_SESSIONS + paramify({ ...query })
  )

  return {
    sessionLogs: data,
    sessionLogsIndex: arrayToIndex<SessionLog>('date', data),
    isLoading,
    isError: !!error,
    mutate: mutate,
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

/** An initial value must be provided to this function, which ensures the return will never be undefined due to fetch time */
export function useRecordWithInit(initialRecord: Record) {
  const res = useRecord(initialRecord._id, { fallbackData: initialRecord })

  return {
    ...res,
    record: res.record as Record,
  }
}

export function useRecord(id: string, config?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<Record | null>(
    URI_RECORDS + id,
    config
  )

  return {
    record: data,
    isError: !!error,
    isLoading,
    // todo: mutate => mutateRecord ? Hard to wrangle with multiple mutates
    mutate: mutate,
  }
}

export function useRecords(query?: RecordQuery, shouldFetch = true) {
  const { data, isLoading, error, mutate } = useSWR<Record[]>(
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
    body: toJson({ id, updates }),
    headers: { 'content-type': 'application/json' },
  })
}

//----------
// EXERCISE
//----------

export function useExercises(query?: ExerciseQuery) {
  const { data, error, mutate } = useSWR<Exercise[]>(
    URI_EXERCISES + paramify({ ...query })
  )

  return {
    exercises: data,
    isError: !!error,
    mutate: mutate,
  }
}

export function useExercise(id: string | null, config?: SWRConfiguration) {
  // passing null to useSWR disables fetching
  const { data, error, mutate } = useSWR<Exercise>(
    id ? URI_EXERCISES + id : null,
    config
  )

  return {
    exercise: data,
    isError: !!error,
    mutate: mutate,
  }
}

/** A wrapper for useExercise to guarantee that the exercise will never be undefined, and assert correct typing.  */
export function useGuaranteedExercise(id: string, fallbackData: Exercise) {
  const res = useExercise(id, { fallbackData })

  return { ...res, exercise: res.exercise as Exercise }
}

export async function addExercise(newExercise: Exercise): Promise<Exercise> {
  return fetchJson(URI_EXERCISES + newExercise.name, {
    method: 'POST',
    body: toJson(newExercise),
    headers: { 'content-type': 'application/json' },
  })
}

export async function updateExercise(newExercise: Exercise): Promise<Exercise> {
  return fetchJson(URI_EXERCISES + newExercise.name, {
    method: 'PUT',
    body: toJson(newExercise),
    headers: { 'content-type': 'application/json' },
  })
}

export async function updateExerciseFields(
  exercise: Exercise,
  updates: Partial<Exercise>
): Promise<Exercise> {
  const id = exercise._id
  return fetchJson(URI_EXERCISES + exercise.name, {
    method: 'PATCH',
    body: toJson({ id, updates }),
    headers: { 'content-type': 'application/json' },
  })
}

//----------
// MODIFIER
//----------

export function useModifiers() {
  const { data, error, mutate } = useSWR<Modifier[]>(URI_MODIFIERS)

  return {
    modifiers: data,
    modifiersIndex: arrayToIndex<Modifier>('name', data),
    isError: !!error,
    mutate: mutate,
  }
}

export async function addModifier(newModifier: Modifier): Promise<Modifier> {
  return fetchJson(URI_MODIFIERS + newModifier.name, {
    method: 'POST',
    body: toJson(newModifier),
    headers: { 'content-type': 'application/json' },
  })
}

// todo: add a modifiers/id/<id> URI? Weird to use name in uri then send id to backend
export async function updateModifierFields(
  modifier: Modifier,
  updates: Partial<Modifier>
): Promise<Modifier> {
  const id = modifier._id
  return fetchJson(URI_MODIFIERS + modifier.name, {
    method: 'PATCH',
    body: toJson({ id, updates }),
    headers: { 'content-type': 'application/json' },
  })
}

//----------
// CATEGORY
//----------

export function useCategories() {
  const { data, error, mutate } = useSWR<Category[]>(URI_CATEGORIES)

  return {
    categories: data,
    isError: !!error,
    mutate: mutate,
  }
}

export async function addCategory(newCategory: Category): Promise<Category> {
  return fetchJson(URI_CATEGORIES + newCategory.name, {
    method: 'POST',
    body: toJson(newCategory),
    headers: { 'content-type': 'application/json' },
  })
}

// todo: add a categories/id/<id> URI? Weird to use name in uri then send id to backend
export async function updateCategoryFields(
  category: Category,
  updates: Partial<Category>
): Promise<Category> {
  const id = category._id
  return fetchJson(URI_CATEGORIES + category.name, {
    method: 'PATCH',
    body: toJson({ id, updates }),
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

  const { data, error, mutate } = useSWR<Bodyweight[]>(
    shouldFetch ? URI_BODYWEIGHT + paramify({ start, end, ...query }) : null
  )

  return {
    data: shouldFetch ? data : [],
    isError: !!error,
    mutate: mutate,
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
