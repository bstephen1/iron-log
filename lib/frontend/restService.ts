import { Dayjs } from 'dayjs'
import useSWR from 'swr'
import Exercise from '../../models/Exercise'
import Modifier from '../../models/Modifier'
import { Session } from '../../models/Session'
import {
  DATE_FORMAT,
  URI_EXERCISES,
  URI_MODIFIERS,
  URI_SESSIONS,
} from './constants'

const fetcher = (url: any) => fetch(url).then((r) => r.json())

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

export function useExercises() {
  const { data, error, mutate } = useSWR<Exercise[]>(URI_EXERCISES, fetcher)

  return {
    exercises: data,
    isError: error,
    mutate: mutate,
  }
}

export function useActiveExercises() {
  const { data, error, mutate } = useSWR<Exercise[]>(
    URI_EXERCISES + '?status=active',
    fetcher
  )

  return {
    activeExercises: data,
    isError: error,
    mutate: mutate,
  }
}

export function useModifiers() {
  const { data, error, mutate } = useSWR<Modifier[]>(URI_MODIFIERS, fetcher)

  return {
    modifiers: data,
    isError: error,
    mutate: mutate,
  }
}

export async function createSession(session: Session) {
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

export async function updateExercise(newExercise: Exercise) {
  fetch(URI_EXERCISES + newExercise.name, {
    method: 'PUT',
    body: JSON.stringify(newExercise),
  }).catch((e) => console.error(e))
}

export async function updateModifier(newModifier: Modifier) {
  fetch(URI_MODIFIERS + newModifier.name, {
    method: 'PUT',
    body: JSON.stringify(newModifier),
  }).catch((e) => console.error(e))
}
