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

const toNames = (options?: AsyncSelectorOption[]) =>
  options?.map((option) => option.name) ?? []

/** sorts first by status, then by name */
const dataSort = <T extends { name: string; status: Status }>(data?: T[]) =>
  data?.sort((a, b) => {
    const status = StatusOrder[a.status] - StatusOrder[b.status]

    return status || a.name.localeCompare(b.name)
  }) ?? []

// ---------------
// PREFETCHED HOOKS
// ---------------

// These queries are used very often so they are prefetched in the root app layout.
// This means they will *never* be undefined. Their data is included in the first render.
// Because of this, they can useSuspenseQuery to guarantee type safety.
// For useSuspenseQuery, the loading state is caught by a <Suspense> wrapper.
// One should be placed in the root app layout as a failsafe, but the prefetches should
// prevent it from ever being triggered. NOTE: cannot use "enabled" with useSuspenseQuery

// However, we useQuery instead. The data will still never be undefined, but
// undefined is still in the type signature. There is no change to the app,
// but useQuery is easier to create unit tests for (useSuspenseQuery results
// in an initial undefiend response since the prefetch isn't loaded in the test env).

export function useExercises() {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.exercises],
    queryFn: fetchExercises,
    select: dataSort,
  })

  return data ?? []
}

export function useExerciseNames() {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.exercises],
    queryFn: fetchExercises,
    select: toNames,
  })

  return data ?? []
}

export function useModifiers() {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.modifiers],
    queryFn: fetchModifiers,
    select: dataSort,
  })

  return data ?? []
}

export function useModifierNames() {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.modifiers],
    queryFn: fetchModifiers,
    select: toNames,
  })

  return data ?? []
}

export function useCategories() {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.categories],
    queryFn: fetchCategories,
    select: dataSort,
  })

  return data ?? []
}

export function useCategoryNames() {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.categories],
    queryFn: fetchCategories,
    select: toNames,
  })

  return data ?? []
}

// ----------------
// STANDARD HOOKS
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

// It is also important to only pull out fields from the useQuery return that are
// desired (typically data and isLoading). Unneeded fields can trigger extra rerenders
// when they change, but if they aren't accessed they will not trigger anything.

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
