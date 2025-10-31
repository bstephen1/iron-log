import {
  type MutationFunction,
  type QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import type { AsyncSelectorOption } from '../../models/AsyncSelectorOption'
import type { BodyweightQuery } from '../../models/Bodyweight'
import type FetchOptions from '../../models/FetchOptions'
import {
  buildRecordFilter,
  isRecord,
  type RecordQuery,
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
import { arrayToIndex } from './Index'

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
      // Cancel any ongoing queries to prevent stale requests from overwriting
      // the new optimistic data. This is kept in onMutate so it can be async.
      // This triggers after setting optimistic data but the effect should be the same as
      // if it was invoked beforehand.
      await queryClient.cancelQueries({
        queryKey,
      })
    },
    onError: async (_err, _variables) => {
      // rather than saving a snapshot and rolling back, we simply invalidate and refetch
      await queryClient.invalidateQueries({ queryKey })
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

interface ReplaceMutationProps<T>
  extends Omit<OptimisticProps, 'updater' | 'mutationFn'> {
  replaceFn: (newItem: T) => Promise<T>
}
/** replace a singular record cache with its updated value */
export function useReplaceMutation<T>({
  replaceFn,
  ...rest
}: ReplaceMutationProps<T>) {
  return useOptimisticMutation<T, T>({
    ...rest,
    mutationFn: (newItem) => replaceFn(newItem),
    updater: (_, newItem) => newItem,
  })
}

interface AddMutationProps<T>
  extends Omit<OptimisticProps, 'updater' | 'mutationFn'> {
  addFn: (newItem: T) => Promise<T>
}
/** Add a new record to a cache of arrays */
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
/** Update an existing record in a cache of arrays */
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
/** Delete a record from a cache of arrays */
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

/** NOTE: this is a singular record so cannot use the generic useAddMutation,
 *  which is for arrays
 */
export function useSessionLog(day: Dayjs | string) {
  const date = typeof day === 'string' ? day : day.format(DATE_FORMAT)

  return useQuery({
    queryKey: [QUERY_KEYS.sessionLogs, date],
    queryFn: () => fetchSessionLog(date),
  })
}

export function useSessionLogs(query: FetchOptions) {
  const hook = useQuery({
    queryKey: [QUERY_KEYS.sessionLogs, query],
    queryFn: () => fetchSessionLogs(query),
  })

  return {
    ...hook,
    index: arrayToIndex('date', hook.data),
  }
}

export function useRecords(query?: RecordQuery & FetchOptions, enabled = true) {
  const hook = useQuery({
    queryKey: [QUERY_KEYS.records, query],
    queryFn: () => fetchRecords(buildRecordFilter(query)),
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

  const { data, ...rest } = useQuery({
    queryKey: [QUERY_KEYS.bodyweights, formattedQuery],
    queryFn: () => fetchBodyweights(formattedQuery),
    enabled,
  })

  return {
    data: enabled ? data : [],
    ...rest,
  }
}
