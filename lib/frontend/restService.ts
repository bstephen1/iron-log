import { Dayjs } from 'dayjs'
import useSWR from 'swr'
import Category from '../../models/Category'
import Exercise from '../../models/Exercise'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import Modifier from '../../models/Modifier'
import Record from '../../models/Record'
import Session from '../../models/Session'
import { DATE_FORMAT } from './constants'

const fetcher = (url: any) => fetch(url).then((r) => r.json())

//---------
// SESSION
//---------

export function useSession(date: Dayjs) {
  const { data, error, mutate } = useSWR<Session>(
    URI_SESSIONS + date.format(DATE_FORMAT),
    fetcher
  )

  return {
    session: data,
    isError: error,
    mutate: mutate,
  }
}

export async function addSession(session: Session) {
  fetch(URI_SESSIONS + session.date, {
    method: 'POST',
    body: JSON.stringify(session),
  }).catch((e) => console.error(e))
}

export async function updateSession(newSesson: Session) {
  fetch(URI_SESSIONS + newSesson.date, {
    method: 'PUT',
    body: JSON.stringify(newSesson),
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

export async function updateModifier(newModifier: Modifier) {
  fetch(URI_MODIFIERS + newModifier.name, {
    method: 'PUT',
    body: JSON.stringify(newModifier),
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

//------
// URIS
//------

export const URI_SESSIONS = '/api/sessions/'
export const URI_EXERCISES = '/api/exercises/'
export const URI_MODIFIERS = '/api/modifiers/'
export const URI_CATEGORIES = '/api/categories/'
export const URI_RECORDS = '/api/records/'
