import dayjs, { Dayjs } from 'dayjs'
import useSWR from 'swr'
import Bodyweight from '../../models/Bodyweight'
import Category from '../../models/Category'
import Exercise from '../../models/Exercise'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import Modifier from '../../models/Modifier'
import { BodyweightQuery } from '../../models/query-filters/BodyweightQuery'
import Record from '../../models/Record'
import SessionLog from '../../models/SessionLog'
import { DATE_FORMAT } from './constants'

const fetcher = (url: any) => fetch(url).then((r) => r.json())

//---------
// SESSION
//---------

export function useSessionLog(date: Dayjs) {
  const { data, error, mutate } = useSWR<SessionLog>(
    URI_SESSIONS + date.format(DATE_FORMAT),
    fetcher
  )

  return {
    sessionLog: data,
    isError: error,
    mutate: mutate,
  }
}

export async function addSessionLog(session: SessionLog) {
  fetch(URI_SESSIONS + session.date, {
    method: 'POST',
    body: JSON.stringify(session),
  }).catch((e) => console.error(e))
}

export async function updateSessionLog(newSesson: SessionLog) {
  fetch(URI_SESSIONS + newSesson.date, {
    method: 'PUT',
    body: JSON.stringify(newSesson),
  }).catch((e) => console.error(e))
}

export async function deleteSessionRecord(date: string, recordId: string) {
  fetch(`${URI_SESSIONS}${date}/records/${recordId}`, {
    method: 'DELETE',
  }).catch((e) => console.error(e))
}

//--------
// RECORD
//--------

export function useRecord(id: Record['_id']) {
  const { data, error, mutate } = useSWR<Record>(URI_RECORDS + id, fetcher)

  return {
    record: data,
    isError: error,
    // todo: mutate => mutateRecord ? Hard to wrangle with multiple mutates
    mutate: mutate,
  }
}

export async function addRecord(newRecord: Record) {
  fetch(URI_RECORDS + newRecord._id, {
    method: 'POST',
    body: JSON.stringify(newRecord),
  }).catch((e) => console.error(e))
}

export async function updateRecordFields(
  id: Record['_id'],
  updates: Partial<Record>
) {
  fetch(URI_RECORDS + id, {
    method: 'PATCH',
    body: JSON.stringify({ id, updates }),
  }).catch((e) => console.error(e))
}

//----------
// EXERCISE
//----------

// todo: make params more robust
export function useExercises({ status }: { status?: ExerciseStatus }) {
  const params = status ? '?status=' + status : ''

  const { data, error, mutate } = useSWR<Exercise[]>(
    URI_EXERCISES + params,
    fetcher
  )

  return {
    exercises: data,
    isError: error,
    mutate: mutate,
  }
}

export function useExercise(id: Exercise['_id']) {
  const { data, error, mutate } = useSWR<Exercise>(URI_EXERCISES + id, fetcher)

  return {
    exercise: data,
    isError: error,
    mutate: mutate,
  }
}

export async function addExercise(newExercise: Exercise) {
  fetch(URI_EXERCISES + newExercise.name, {
    method: 'POST',
    body: JSON.stringify(newExercise),
  }).catch((e) => console.error(e))
}

export async function updateExercise(newExercise: Exercise) {
  fetch(URI_EXERCISES + newExercise.name, {
    method: 'PUT',
    body: JSON.stringify(newExercise),
  }).catch((e) => console.error(e))
}

export async function updateExerciseFields(
  exercise: Exercise,
  updates: Partial<Exercise>
) {
  const id = exercise._id
  fetch(URI_EXERCISES + exercise.name, {
    method: 'PATCH',
    body: JSON.stringify({ id, updates }),
  }).catch((e) => console.error(e))
}

//----------
// MODIFIER
//----------

export function useModifiers() {
  const { data, error, mutate } = useSWR<Modifier[]>(URI_MODIFIERS, fetcher)

  return {
    modifiers: data,
    isError: error,
    mutate: mutate,
  }
}

export async function addModifier(newModifier: Modifier) {
  fetch(URI_MODIFIERS + newModifier.name, {
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
  fetch(URI_MODIFIERS + modifier.name, {
    method: 'PATCH',
    body: JSON.stringify({ id, updates }),
  }).catch((e) => console.error(e))
}

//----------
// CATEGORY
//----------

export function useCategories() {
  const { data, error, mutate } = useSWR<Category[]>(URI_CATEGORIES, fetcher)

  return {
    categories: data,
    isError: error,
    mutate: mutate,
  }
}

export async function addCategory(newCategory: Category) {
  fetch(URI_CATEGORIES + newCategory.name, {
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
  fetch(URI_CATEGORIES + category.name, {
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

  // this leaves extra chars but doesn't seem to affect the rest call
  const paramString = `?${limit && 'limit=' + limit}&${
    start && 'start=' + start
  }&${end && 'end=' + end}&${type && 'type=' + type}`
  const { data, error, mutate } = useSWR<Bodyweight[]>(
    URI_BODYWEIGHT + paramString,
    fetcher
  )

  return {
    data: data,
    isError: error,
    mutate: mutate,
  }
}

export async function addBodyweight(newBodyweight: Bodyweight) {
  fetch(URI_BODYWEIGHT, {
    method: 'POST',
    body: JSON.stringify(newBodyweight),
  }).catch((e) => console.error(e))
}

export async function updateBodyweight(newBodyweight: Bodyweight) {
  fetch(URI_BODYWEIGHT, {
    method: 'PUT',
    body: JSON.stringify(newBodyweight),
  }).catch((e) => console.error(e))
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
