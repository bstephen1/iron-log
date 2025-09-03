import {
  type MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
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

type OptimisticProps<
  TQueryFnData = unknown,
  TData = unknown,
  TVariables = TData,
> = {
  mutationFn: MutationFunction<TData, TVariables>
  /** Key to trigger optimistic data. No optimistic data will be set if omitted. */
  queryKey?: QueryKey
  updater: (
    input: TQueryFnData | undefined,
    variables: TVariables
  ) => TQueryFnData | undefined
  invalidates?: QueryKey
}
const useOptimisticMutation = <
  TQueryFnData = unknown,
  TData = unknown,
  TVariables = TData,
>({
  mutationFn,
  queryKey,
  updater,
  invalidates,
}: OptimisticProps<TQueryFnData, TData, TVariables>) => {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn,
    onMutate: async () => {
      console.log('ON_MUTATE CLIENT')
      // Cancel any ongoing queries to prevent stale requests from overwriting
      // the new optimistic data. This is kept in onMutate so it can be async.
      // This triggers after setting optimistic data but the effect should be the same as
      // if it was invoked beforehand.
      await queryClient.cancelQueries({
        queryKey,
      })
    },
    onError: (_err, _variables) => {
      // rather than saving a snapshot and rolling back, we simply invalidate and refetch
      queryClient.invalidateQueries({ queryKey })
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: invalidates,
      })
    },
  })

  return (...args: Parameters<typeof mutate>) => {
    const [variables, _options] = args
    const queryClient = getQueryClient()

    // onMutate in the useMutation hook actually triggers AFTER an initial render with
    // the stale data. This can cause disruptive screen flashing (especially when adding
    // a new item on the manage screen). By setting the optimstic data BEFORE invoking
    // mutate(), we ensure the cache is updated on the first possible render.
    if (queryKey) {
      queryClient.setQueryData<TQueryFnData>(queryKey, (input) =>
        updater(input, variables)
      )
    }
    mutate(...args)
  }
}

interface AddMutationProps<T>
  extends Omit<OptimisticProps, 'updater' | 'mutationFn'> {
  addFn: (newItem: T) => Promise<T>
}
export function useAddMutation<T>({ addFn, ...rest }: AddMutationProps<T>) {
  return useOptimisticMutation<T[], T>({
    ...rest,
    mutationFn: (newItem) => addFn(newItem),
    updater: (prev = [], newItem) => {
      // Record must also update SessionLog to show it has been added
      if (isRecord(newItem)) {
        const { _id, date } = newItem
        const queryClient = getQueryClient()
        queryClient.setQueryData<SessionLog>(
          [QUERY_KEYS.sessionLogs, date],
          (prev) =>
            createSessionLog(
              date,
              (prev?.records ?? []).concat(_id),
              prev?.notes ?? []
            )
        )
      }

      return [...prev, newItem]
    },
  })
}

interface UpdateMutationProps<T>
  extends Omit<OptimisticProps, 'updater' | 'mutationFn'> {
  updateFn: (id: string, updates: Partial<T>) => Promise<T>
}
export function useUpdateMutation<T extends { _id: string }>({
  updateFn,
  ...rest
}: UpdateMutationProps<T>) {
  return useOptimisticMutation<T[], T, { _id: string; updates: Partial<T> }>({
    ...rest,
    mutationFn: ({ _id, updates }) => updateFn(_id, updates),
    // record and session don't need to sync like with Add/Delete because
    // amount of records isn't changing
    updater: (prev = [], { _id, updates }) =>
      prev.map((item) => (item._id === _id ? { ...item, ...updates } : item)),
  })
}

interface DeleteMutationProps
  extends Omit<OptimisticProps, 'updater' | 'mutationFn'> {
  deleteFn: (id: string) => Promise<string>
}
export function useDeleteMutation({ deleteFn, ...rest }: DeleteMutationProps) {
  return useOptimisticMutation<{ _id: string }[], string>({
    ...rest,
    mutationFn: (id) => deleteFn(id),
    updater: (prev = [], id) => {
      const { date } = (rest.queryKey?.find(
        (key) => !!key && typeof key === 'object' && 'date' in key
      ) || {}) as { date: string }
      if (date) {
        const queryClient = getQueryClient()
        queryClient.setQueryData<SessionLog>(
          [QUERY_KEYS.sessionLogs, date],
          (prev) =>
            createSessionLog(
              date,
              (prev?.records ?? []).filter((_id) => _id !== id),
              prev?.notes ?? []
            )
        )
      }

      return prev.filter((item) => item._id !== id)
    },
  })
}

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
