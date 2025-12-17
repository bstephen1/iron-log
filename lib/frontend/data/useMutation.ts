import {
  type MutationFunction,
  type QueryKey,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { isRecord } from '../../../models/Record'
import { createSessionLog, type SessionLog } from '../../../models/SessionLog'
import getQueryClient from '../../getQueryClient'
import { QUERY_KEYS } from '../constants'
import { enqueueError } from '../snackbar'

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
export const useOptimisticMutation = <
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
    onError: async () => {
      // rather than saving a snapshot and rolling back, we simply invalidate and refetch
      await queryClient.invalidateQueries({ queryKey })
      enqueueError('Something went wrong! Changes were not saved.')
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
