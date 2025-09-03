import {
  useQuery,
  useSuspenseQuery,
  type QueryKey,
} from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { enqueueSnackbar } from 'notistack'
import { arrayToIndex } from '../../lib/util'
import type DateRangeQuery from '../../models//DateRangeQuery'
import { dateRangeQuerySchema } from '../../models//DateRangeQuery'
import { type AsyncSelectorOption } from '../../models/AsyncSelectorOption'
import {
  bodyweightQuerySchema,
  type BodyweightRangeQuery,
} from '../../models/Bodyweight'
import {
  isRecord,
  recordQuerySchema,
  type RecordRangeQuery,
} from '../../models/Record'
import { createSessionLog, type SessionLog } from '../../models/SessionLog'
import {
  fetchBodyweights,
  fetchCategories,
  fetchExercises,
  fetchModifiers,
  fetchRecords,
  fetchSessionLog,
  fetchSessionLogs,
} from '../backend/mongoService'
import getQueryClient from '../getQueryClient'
import { DATE_FORMAT, QUERY_KEYS } from './constants'
import { enqueueError } from './util'

interface SaveToDbProps {
  dbFunction: () => Promise<unknown>
  errorMessage?: string
  successMessage?: string
  optimistic?: {
    key: QueryKey
    mutate: () => void
    /** Any keys in addition to the primary key to rollback on error.
     *  Note this is an array of arrays to allow for multiple sets of query keys
     *  to be revalidated
     */
    rollbackKeys?: QueryKey[]
  }
  invalidates?: QueryKey
}
/** rather than calling useMutation, we handle the optimistic cache
 *  updates directly. This allows using a function instead of a hook,
 *  which is more convenient and allows more fine-grained control.
 *
 *  Also, setting the cache is faster in the ui.
 */
async function saveToDb({
  dbFunction,
  errorMessage,
  successMessage,
  optimistic,
  invalidates,
}: SaveToDbProps) {
  const queryClient = getQueryClient()
  if (optimistic) {
    await queryClient.cancelQueries({
      queryKey: optimistic.key,
    })

    optimistic.mutate()
  }

  try {
    await dbFunction()
    if (successMessage) {
      enqueueSnackbar(successMessage, { severity: 'success' })
    }
  } catch (e) {
    enqueueError(errorMessage ?? 'could not save changes')
    if (optimistic) {
      const keys = [...(optimistic.rollbackKeys ?? []), optimistic.key]
      keys.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey })
      })
    }
  }

  queryClient.invalidateQueries({ queryKey: invalidates })
  // not sure if this really makes any noticeable difference
  if (optimistic) {
    queryClient.invalidateQueries({ queryKey: optimistic.key })
  }
}

export interface DbAddProps<P extends { _id: string }>
  extends Omit<SaveToDbProps, 'dbFunction' | 'optimistic'> {
  optimisticKey?: QueryKey
  addFunction: (newItem: P) => Promise<P>
  newItem: P
}
export async function dbAdd<P extends { _id: string }>({
  optimisticKey,
  newItem,
  addFunction,
  ...rest
}: DbAddProps<P>) {
  const queryClient = getQueryClient()
  // Record must also update SessionLog to show it has been added
  const date = isRecord(newItem) ? newItem.date : undefined

  const optimisticMutate = (queryKey: QueryKey) => {
    queryClient.setQueryData<P[]>(queryKey, (prev = []) => [...prev, newItem])
    if (date) {
      queryClient.setQueryData<SessionLog>(
        [QUERY_KEYS.sessionLogs, date],
        (prev) =>
          createSessionLog(date, prev?.records.concat(newItem._id), prev?.notes)
      )
    }
  }

  saveToDb({
    dbFunction: () => addFunction(newItem),
    optimistic: optimisticKey
      ? {
          key: optimisticKey,
          mutate: () => optimisticMutate(optimisticKey),
          rollbackKeys: date ? [[QUERY_KEYS.sessionLogs, date]] : undefined,
        }
      : undefined,
    ...rest,
  })
}

interface DbUpdateProps<P extends { _id: string }>
  extends Omit<SaveToDbProps, 'dbFunction' | 'optimistic'> {
  optimisticKey?: unknown[]
  updateFunction: (id: string, updates: Partial<P>) => Promise<P>
  id: string
  updates: Partial<P>
}
export async function dbUpdate<P extends { _id: string }>({
  optimisticKey,
  updateFunction,
  id,
  updates,
  ...rest
}: DbUpdateProps<P>) {
  const queryClient = getQueryClient()

  const optimisticMutate = (queryKey: QueryKey) => {
    queryClient.setQueryData<P[]>(queryKey, (prev) =>
      prev?.map((rec) => (rec._id === id ? { ...rec, ...updates } : rec))
    )
  }

  saveToDb({
    dbFunction: () => updateFunction(id, updates),
    optimistic: optimisticKey
      ? {
          key: optimisticKey,
          mutate: () => optimisticMutate(optimisticKey),
        }
      : undefined,
    ...rest,
  })
}

interface DbDeleteProps
  extends Omit<SaveToDbProps, 'dbFunction' | 'optimistic'> {
  optimisticKey?: unknown[]
  deleteFunction: (id: string) => Promise<string>
  id: string
  /** records should also include the date to update the sessionLog */
  date?: string
}
export async function dbDelete({
  optimisticKey,
  deleteFunction,
  id,
  date,
  ...rest
}: DbDeleteProps) {
  const queryClient = getQueryClient()

  const optimisticMutate = (queryKey: QueryKey) => {
    queryClient.setQueryData<{ _id: string }[]>(queryKey, (prev = []) =>
      prev.filter((item) => item._id !== id)
    )
    if (date) {
      queryClient.setQueryData<SessionLog>(
        [QUERY_KEYS.sessionLogs, date],
        (prev) =>
          prev
            ? {
                ...prev,
                records: prev.records.filter((_id) => _id !== id),
              }
            : undefined
      )
    }
  }

  saveToDb({
    dbFunction: () => deleteFunction(id),
    optimistic: optimisticKey
      ? {
          key: optimisticKey,
          mutate: () => optimisticMutate(optimisticKey),
          rollbackKeys: date ? [[QUERY_KEYS.sessionLogs, date]] : undefined,
        }
      : undefined,
    ...rest,
  })
}

//----------
// FETCHING
//----------

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

const nameSort = <T extends { name: string }>(data?: T[]) =>
  data?.sort((a, b) => a.name.localeCompare(b.name)) ?? []

export function useSessionLog(day: Dayjs | string) {
  const date = typeof day === 'string' ? day : day.format(DATE_FORMAT)

  return useQuery({
    queryKey: [QUERY_KEYS.sessionLogs, date],
    queryFn: () => fetchSessionLog(date),
  })
}

export function useSessionLogs(query: DateRangeQuery) {
  const hook = useQuery({
    queryKey: [QUERY_KEYS.sessionLogs, query],
    queryFn: () => fetchSessionLogs(query),
  })

  return {
    ...hook,
    index: arrayToIndex('date', hook.data),
  }
}

export function useRecords(
  query?: RecordRangeQuery & DateRangeQuery,
  enabled = true
) {
  const filter = recordQuerySchema.safeParse(query).data ?? {}
  const dateFilter = dateRangeQuerySchema.safeParse(query).data ?? {}

  const hook = useQuery({
    queryKey: [QUERY_KEYS.records, query],
    queryFn: () => fetchRecords(filter, dateFilter),
    enabled,
  })

  return {
    ...hook,
    index: arrayToIndex('_id', hook.data),
  }
}

export function useExercises({ suspense }: UseOptions = {}) {
  const { data, ...rest } = (suspense ? useSuspenseQuery : useQuery)({
    queryKey: [QUERY_KEYS.exercises],
    queryFn: fetchExercises,
  })

  return {
    data: nameSort(data),
    names: toNames(data),
    index: arrayToIndex('_id', data),
    ...rest,
  }
}

export function useModifiers({ suspense }: UseOptions = {}) {
  const { data, ...rest } = (suspense ? useSuspenseQuery : useQuery)({
    queryKey: [QUERY_KEYS.modifiers],
    queryFn: fetchModifiers,
  })

  return {
    data: nameSort(data),
    names: toNames(data),
    index: arrayToIndex('_id', data),
    ...rest,
  }
}

export function useCategories({ suspense }: UseOptions = {}) {
  const { data, ...rest } = (suspense ? useSuspenseQuery : useQuery)({
    queryKey: [QUERY_KEYS.categories],
    queryFn: fetchCategories,
  })

  return {
    data: nameSort(data),
    names: toNames(data),
    index: arrayToIndex('_id', data),
    ...rest,
  }
}

export function useBodyweights(query?: BodyweightRangeQuery, enabled = true) {
  // bodyweight history is stored as ISO8601, so we need to add a day.
  // 2020-04-02 sorts as less than 2020-04-02T08:02:17-05:00 since there are less chars.
  // Incrementing to 2020-04-03 will catch everything from the previous day.
  const addDay = (date: string) => dayjs(date).add(1, 'day').format(DATE_FORMAT)

  const start = query?.start ? addDay(query.start) : undefined
  const end = query?.end ? addDay(query.end) : undefined

  // todo: probably can get rid of zod now, this is cumbersome anyway.
  // Just separate the filter and date queries?
  const filter = bodyweightQuerySchema.safeParse(query).data ?? {}
  const dateQuery = dateRangeQuerySchema.safeParse({ start, end, ...query })
    .data ?? { start: dayjs().add(-6, 'months').format(DATE_FORMAT) }

  const { data, ...rest } = useQuery({
    queryKey: [QUERY_KEYS.bodyweights, query],
    queryFn: () => fetchBodyweights(filter, dateQuery),
    enabled,
  })

  return {
    data: enabled ? data : [],
    ...rest,
  }
}
