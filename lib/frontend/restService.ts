import dayjs, { Dayjs } from 'dayjs'
import useSWR from 'swr'
import Bodyweight from '../../models/Bodyweight'
import Category from '../../models/Category'
import Exercise from '../../models/Exercise'
import Modifier from '../../models/Modifier'
import BodyweightQuery from '../../models/query-filters/BodyweightQuery'
import DateRangeQuery from '../../models/query-filters/DateRangeQuery'
import Record from '../../models/Record'
import SessionLog from '../../models/SessionLog'
import { Status } from '../../models/Status'
import { arrayToIndex } from '../util'
import { DATE_FORMAT } from './constants'

// Note: make sure any fetch() functions actually return after the fetch!
// Otherwise there's no guarantee the write will be finished before it tries to read again...

//---------
// SESSION
//---------

export function useSessionLog(date: Dayjs) {
  const { data, error, isLoading, mutate } = useSWR<SessionLog>(
    URI_SESSIONS + date.format(DATE_FORMAT)
  )

  return {
    sessionLog: data,
    isError: error,
    isLoading,
    mutate,
  }
}

export function useSessionLogs({ limit, start, end }: DateRangeQuery) {
  // this leaves extra chars but doesn't seem to affect the rest call
  const paramString = buildQuery({ limit, start, end })
  const { data, error, isLoading, mutate } = useSWR<SessionLog[]>(
    URI_SESSIONS + paramString
  )

  return {
    sessionLogs: data,
    sessionLogsIndex: arrayToIndex<SessionLog>('date', data),
    isLoading,
    isError: error,
    mutate: mutate,
  }
}

export async function addSessionLog(session: SessionLog) {
  return fetch(URI_SESSIONS + session.date, {
    method: 'POST',
    body: JSON.stringify(session),
  }).catch((e) => console.error(e))
}

export async function updateSessionLog(newSesson: SessionLog) {
  return fetch(URI_SESSIONS + newSesson.date, {
    method: 'PUT',
    body: JSON.stringify(newSesson),
  }).catch((e) => console.error(e))
}

export async function deleteSessionRecord(date: string, recordId: string) {
  return fetch(`${URI_SESSIONS}${date}/records/${recordId}`, {
    method: 'DELETE',
  }).catch((e) => console.error(e))
}

//--------
// RECORD
//--------

export function useRecord(id: Record['_id']) {
  const { data, error, mutate } = useSWR<Record>(URI_RECORDS + id)

  return {
    record: data,
    isError: error,
    // todo: mutate => mutateRecord ? Hard to wrangle with multiple mutates
    mutate: mutate,
  }
}

export async function addRecord(newRecord: Record) {
  return fetch(URI_RECORDS + newRecord._id, {
    method: 'POST',
    body: JSON.stringify(newRecord),
  }).catch((e) => console.error(e))
}

export async function updateRecordFields(
  id: Record['_id'],
  updates: Partial<Record>
) {
  return fetch(URI_RECORDS + id, {
    method: 'PATCH',
    body: JSON.stringify({ id, updates }),
  }).catch((e) => console.error(e))
}

//----------
// EXERCISE
//----------

export function useExercises({ status }: { status?: Status } = {}) {
  const paramString = buildQuery({ status })

  const { data, error, mutate } = useSWR<Exercise[]>(
    URI_EXERCISES + paramString
  )

  return {
    exercises: data,
    isError: error,
    mutate: mutate,
  }
}

export function useExercise(id: string | null) {
  // passing null to useSWR disables fetching
  const { data, error, mutate } = useSWR<Exercise>(
    id ? URI_EXERCISES + id : null
  )

  return {
    exercise: data,
    isError: error,
    mutate: mutate,
  }
}

export async function addExercise(newExercise: Exercise) {
  return fetch(URI_EXERCISES + newExercise.name, {
    method: 'POST',
    body: JSON.stringify(newExercise),
  }).catch((e) => console.error(e))
}

export async function updateExercise(newExercise: Exercise) {
  return fetch(URI_EXERCISES + newExercise.name, {
    method: 'PUT',
    body: JSON.stringify(newExercise),
  }).catch((e) => console.error(e))
}

export async function updateExerciseFields(
  exercise: Exercise,
  updates: Partial<Exercise>
) {
  const id = exercise._id
  return fetch(URI_EXERCISES + exercise.name, {
    method: 'PATCH',
    body: JSON.stringify({ id, updates }),
  }).catch((e) => console.error(e))
}

//----------
// MODIFIER
//----------

export function useModifiers() {
  const { data, error, mutate } = useSWR<Modifier[]>(URI_MODIFIERS)

  return {
    modifiers: data,
    isError: error,
    mutate: mutate,
  }
}

export async function addModifier(newModifier: Modifier) {
  return fetch(URI_MODIFIERS + newModifier.name, {
    method: 'POST',
    body: JSON.stringify(newModifier),
  }).catch((e) => console.error(e))
}

// todo: add a modifiers/id/<id> URI? Weird to use name in uri then send id to backend
export async function updateModifierFields(
  modifier: Modifier,
  updates: Partial<Modifier>
) {
  const id = modifier._id
  return fetch(URI_MODIFIERS + modifier.name, {
    method: 'PATCH',
    body: JSON.stringify({ id, updates }),
  }).catch((e) => console.error(e))
}

//----------
// CATEGORY
//----------

export function useCategories() {
  const { data, error, mutate } = useSWR<Category[]>(URI_CATEGORIES)

  return {
    categories: data,
    isError: error,
    mutate: mutate,
  }
}

export async function addCategory(newCategory: Category) {
  return fetch(URI_CATEGORIES + newCategory.name, {
    method: 'POST',
    body: JSON.stringify(newCategory),
  }).catch((e) => console.error(e))
}

// todo: add a categories/id/<id> URI? Weird to use name in uri then send id to backend
export async function updateCategoryFields(
  category: Category,
  updates: Partial<Category>
) {
  const id = category._id
  return fetch(URI_CATEGORIES + category.name, {
    method: 'PATCH',
    body: JSON.stringify({ id, updates }),
  }).catch((e) => console.error(e))
}

//------------
// BODYWEIGHT
//------------

export function useBodyweightHistory({
  limit,
  start,
  end,
  type,
}: BodyweightQuery) {
  // bodyweight history is stored as ISO8601, so we need to add a day.
  // 2020-04-02 sorts as less than 2020-04-02T08:02:17-05:00 since there are less chars.
  // Incrementing to 2020-04-03 will catch everything from the previous day.
  const addDay = (date: string) => dayjs(date).add(1, 'day').format(DATE_FORMAT)

  start = start ? addDay(start) : start
  end = end ? addDay(end) : end

  const paramString = buildQuery({ limit, start, end, type })
  const { data, error, mutate } = useSWR<Bodyweight[]>(
    URI_BODYWEIGHT + paramString
  )

  return {
    data: data,
    isError: error,
    mutate: mutate,
  }
}

export async function addBodyweight(newBodyweight: Bodyweight) {
  return fetch(URI_BODYWEIGHT, {
    method: 'POST',
    body: JSON.stringify(newBodyweight),
  }).catch((e) => console.error(e))
}

export async function updateBodyweight(newBodyweight: Bodyweight) {
  return fetch(URI_BODYWEIGHT, {
    method: 'PUT',
    body: JSON.stringify(newBodyweight),
  }).catch((e) => console.error(e))
}

//-------------------
// PRIVATE FUNCTIONS
//-------------------

function buildQuery(params: { [param: string]: string | number | undefined }) {
  let query = '?'
  Object.keys(params).forEach((key) => {
    query =
      params[key] !== undefined ? query.concat(`${key}=${params[key]}&`) : query
  })

  // remove trailing '&', and remove '?' if there are no params
  return query === '?' ? '' : query.slice(0, -1)
}

//------
// URIS
//------

export const URI_SESSIONS = '/api/sessions/'
export const URI_EXERCISES = '/api/exercises/'
export const URI_MODIFIERS = '/api/modifiers/'
export const URI_CATEGORIES = '/api/categories/'
export const URI_RECORDS = '/api/records/'
export const URI_BODYWEIGHT = '/api/bodyweight-history/'
