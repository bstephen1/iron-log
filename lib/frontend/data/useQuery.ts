import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import type { AsyncSelectorOption } from '../../../models/AsyncSelectorOption'
import type { BodyweightQuery } from '../../../models/Bodyweight'
import type FetchOptions from '../../../models/FetchOptions'
import {
  buildRecordFilter,
  type Record,
  type RecordQuery,
} from '../../../models/Record'
import { type Status, StatusOrder } from '../../../models/Status'
import {
  fetchBodyweights,
  fetchCategories,
  fetchExercises,
  fetchModifiers,
  fetchRecords,
  fetchSessionLog,
  fetchSessionLogs,
} from '../../backend/mongoService'
import { DATE_FORMAT, QUERY_KEYS } from '../constants'
import { arrayToIndex } from '../Index'

interface UseOptions {
  /** Use useSuspenseQuery. Must have a Suspense boundary wrapped around the
   *  component using this option. The component will be given a promise from
   *  the server and the Suspense boundary will render until the promise resolves.
   */
  suspense?: boolean
  /** Determines whether the fetch will occur. Defaults to true.
   *  NOTE: cannot use with useSuspenseQuery.
   */
  enabled?: boolean
}

const toNames = (entities?: AsyncSelectorOption[]) =>
  entities?.map((entity) => entity.name) ?? []

/** sorts first by status, then by name */
const dataSort = <T extends { name: string; status: Status }>(data?: T[]) =>
  data?.sort((a, b) => {
    const status = StatusOrder[a.status] - StatusOrder[b.status]

    return status || a.name.localeCompare(b.name)
  }) ?? []

// ----------------
// ROOT QUERIES
// ----------------

// These queries have their own query keys. Anything
// using them will be updated whenever element in the data changes.

export function useSessionLog(day: Dayjs | string) {
  const date = typeof day === 'string' ? day : day.format(DATE_FORMAT)

  return useQuery({
    queryKey: [QUERY_KEYS.sessionLogs, date],
    queryFn: () => fetchSessionLog(date),
  })
}

export function useSessionLogs(query: FetchOptions) {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.sessionLogs, query],
    queryFn: () => fetchSessionLogs(query),
  })

  return {
    data,
    isLoading,
    index: arrayToIndex('date', data),
  }
}

export function useRecords(query?: RecordQuery & FetchOptions, enabled = true) {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.records, query],
    queryFn: () => fetchRecords(buildRecordFilter(query)),
    enabled,
    select: (data) => data,
  })

  return {
    data,
    isLoading,
    index: arrayToIndex('_id', data),
  }
}

export function useExercises({ suspense }: UseOptions = {}) {
  const { data } = (suspense ? useSuspenseQuery : useQuery)({
    queryKey: [QUERY_KEYS.exercises],
    queryFn: fetchExercises,
    select: (data) => data,
  })

  return {
    data: dataSort(data),
    names: toNames(data),
    index: arrayToIndex('_id', data),
  }
}

// todo
export function useExercisesNew() {
  const { data: exercises } = useQuery({
    queryKey: [QUERY_KEYS.exercises],
    queryFn: fetchExercises,
    select: dataSort,
  })

  return exercises ?? []
}

export function useModifiers({ suspense }: UseOptions = {}) {
  const { data } = (suspense ? useSuspenseQuery : useQuery)({
    queryKey: [QUERY_KEYS.modifiers],
    queryFn: fetchModifiers,
    select: (data) => data,
  })

  return {
    data: dataSort(data),
    names: toNames(data),
    index: arrayToIndex('_id', data),
  }
}

export function useCategories({ suspense }: UseOptions = {}) {
  const { data } = (suspense ? useSuspenseQuery : useQuery)({
    queryKey: [QUERY_KEYS.categories],
    queryFn: fetchCategories,
    select: (data) => data,
  })

  return {
    data: dataSort(data),
    names: toNames(data),
    index: arrayToIndex('_id', data),
  }
}

export function useBodyweights(query?: BodyweightQuery, enabled = true) {
  // bodyweight history is stored as ISO8601, so we need to add a day.
  // 2020-04-02 sorts as less than 2020-04-02T08:02:17-05:00 since there are less chars.
  // Incrementing to 2020-04-03 will catch everything from the previous day.
  const addDay = (date: string) => dayjs(date).add(1, 'day').format(DATE_FORMAT)

  const start = query?.start ? addDay(query.start) : undefined
  const end = query?.end ? addDay(query.end) : undefined

  const formattedQuery = query
    ? { ...query, start, end }
    : { start: dayjs().add(-6, 'months').format(DATE_FORMAT) }

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.bodyweights, formattedQuery],
    queryFn: () => fetchBodyweights(formattedQuery),
    select: (data) => data,
    enabled,
  })

  return {
    data: enabled ? data : [],
  }
}

// ----------------------
// PERFORMANCE HOOKS
// ----------------------

// These queries are built using the root queries as a base.
// Tanstack's `select` field lets the hook subscribe to only the data
// it needs, so if any other data in the cache is updated it does
// not trigger a rerender. This allows reusing the cache instead of performing
// extra fetches without the penalty of triggering rerenders whenever any element
// in an array changes.

const findFromId = <T extends { _id: string }>(data: T[], id?: string) =>
  data.find((thing) => thing._id === id)

export function useRecord(id: string, date: string) {
  const { data: record } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.records, { date }],
    queryFn: () => fetchRecords(buildRecordFilter({ date })),
    select: (data) => findFromId(data, id),
  })

  return record as Record
}

export function useRecordSides(id = '', date: string) {
  const { data: sides } = useQuery({
    queryKey: [QUERY_KEYS.records, { date }],
    queryFn: () => fetchRecords(buildRecordFilter({ date })),
    select: (data) => findFromId(data, id)?.sets.map((set) => set.side),
  })

  return sides ?? []
}

export function useRecordSet(id = '', date: string, index: number) {
  const { data: set } = useQuery({
    queryKey: [QUERY_KEYS.records, { date }],
    queryFn: () => fetchRecords(buildRecordFilter({ date })),
    select: (data) => findFromId(data, id)?.sets[index],
  })

  return set ?? {}
}

export function useExercise(id?: string) {
  const { data: exercise } = useQuery({
    queryKey: [QUERY_KEYS.exercises],
    queryFn: fetchExercises,
    select: (data) => findFromId(data, id),
    enabled: !!id,
  })

  return exercise ?? null
}

export function useExerciseModifiers(id?: string) {
  const { data: modifiers } = useQuery({
    queryKey: [QUERY_KEYS.exercises],
    queryFn: fetchExercises,
    select: (data) => findFromId(data, id)?.modifiers,
    enabled: !!id,
  })

  return modifiers ?? []
}

export function useCategoryNames({ suspense }: UseOptions = {}) {
  const { data } = (suspense ? useSuspenseQuery : useQuery)({
    queryKey: [QUERY_KEYS.categories],
    queryFn: fetchCategories,
    select: toNames,
  })

  return data
}
