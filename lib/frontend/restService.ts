import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
  type MutationFunction,
  type QueryKey,
} from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { arrayToIndex } from '../../lib/util'
import type DateRangeQuery from '../../models//DateRangeQuery'
import { dateRangeQuerySchema } from '../../models//DateRangeQuery'
import { type AsyncSelectorOption } from '../../models/AsyncSelectorOption'
import { type Category } from '../../models/AsyncSelectorOption/Category'
import { type Exercise } from '../../models/AsyncSelectorOption/Exercise'
import { type Modifier } from '../../models/AsyncSelectorOption/Modifier'
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
  addCategory,
  addExercise,
  addModifier,
  deleteCategory,
  deleteExercise,
  deleteModifier,
  fetchBodyweights,
  fetchCategories,
  fetchExercises,
  fetchModifiers,
  fetchRecords,
  fetchSessionLog,
  fetchSessionLogs,
  updateCategoryFields,
  updateExerciseFields,
  updateModifierFields,
} from '../backend/mongoService'
import getQueryClient from '../getQueryClient'
import { DATE_FORMAT, QUERY_KEYS } from './constants'
import { enqueueError } from './util'

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

type OptimisticProps2<
  TQueryFnData = unknown,
  TData = unknown,
  TVariables = TData,
> = {
  mutationFn: MutationFunction<TData, TVariables>
  queryKey: QueryKey
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
}: OptimisticProps2<TQueryFnData, TData, TVariables>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey,
      })

      const snapshot = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<TQueryFnData>(queryKey, (input) =>
        updater(input, variables)
      )

      return () => {
        queryClient.setQueryData(queryKey, snapshot)
      }
    },
    onError: (_err, _variables, rollback) => {
      rollback?.()
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: invalidates,
      })
    },
  })
}

//---------
// SESSION
//---------

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

//--------
// RECORD
//--------

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

interface SaveToDbProps {
  dbFunction: () => Promise<unknown>
  errorMessage?: string
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
async function saveToDb({
  dbFunction,
  errorMessage,
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
}

interface DbAddProps<P extends { _id: string }>
  extends Pick<SaveToDbProps, 'errorMessage' | 'invalidates'> {
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
  extends Pick<SaveToDbProps, 'errorMessage' | 'invalidates'> {
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
  extends Pick<SaveToDbProps, 'errorMessage' | 'invalidates'> {
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
// EXERCISE
//----------

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

export function useExerciseUpdate() {
  const { mutate } = useOptimisticMutation<
    Exercise[],
    Exercise,
    {
      _id: string
      updates: Partial<Exercise>
    }
  >({
    mutationFn: ({ _id, updates }) => updateExerciseFields(_id, updates),
    queryKey: [QUERY_KEYS.exercises],
    updater: (prev, { _id, updates }) =>
      prev?.map((cat) => (cat._id === _id ? { ...cat, ...updates } : cat)),
  })
  return mutate
}

export function useExerciseAdd() {
  const { mutate } = useOptimisticMutation<Exercise[], Exercise>({
    mutationFn: (exercise: Exercise) => addExercise(exercise),
    queryKey: [QUERY_KEYS.exercises],
    updater: (prev, exercise) => prev?.concat(exercise),
  })
  return mutate
}

export function useExerciseDelete() {
  const { mutate } = useOptimisticMutation<Exercise[], string>({
    mutationFn: (id: string) => deleteExercise(id),
    queryKey: [QUERY_KEYS.exercises],
    updater: (prev, id) => prev?.filter((item) => item._id !== id),
  })
  return mutate
}

//----------
// MODIFIER
//----------

export function useModifierUpdate() {
  const { mutate } = useOptimisticMutation<
    Modifier[],
    Modifier,
    {
      _id: string
      updates: Partial<Modifier>
    }
  >({
    mutationFn: ({ _id, updates }) => updateModifierFields(_id, updates),
    queryKey: [QUERY_KEYS.modifiers],
    updater: (prev, { _id, updates }) =>
      prev?.map((cat) => (cat._id === _id ? { ...cat, ...updates } : cat)),
    invalidates: ['exercises'],
  })
  return mutate
}

export function useModifierAdd() {
  const { mutate } = useOptimisticMutation<Modifier[], Modifier>({
    mutationFn: (modifier: Modifier) => addModifier(modifier),
    queryKey: [QUERY_KEYS.modifiers],
    updater: (prev, modifier) => prev?.concat(modifier),
  })
  return mutate
}

export function useModifierDelete() {
  const { mutate } = useOptimisticMutation<Modifier[], string>({
    mutationFn: (id: string) => deleteModifier(id),
    queryKey: [QUERY_KEYS.modifiers],
    updater: (prev, id) => prev?.filter((item) => item._id !== id),
  })
  return mutate
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

//----------
// CATEGORY
//----------

export function useCategoryUpdate() {
  const { mutate } = useOptimisticMutation<
    Category[],
    Category,
    {
      _id: string
      name: string
      updates: Partial<Category>
    }
  >({
    mutationFn: ({ _id, updates }) => updateCategoryFields(_id, updates),
    queryKey: [QUERY_KEYS.categories],
    updater: (prev, { _id, updates }) =>
      prev?.map((cat) => (cat._id === _id ? { ...cat, ...updates } : cat)),
    invalidates: ['exercises'],
  })
  return mutate
}

export function useCategoryAdd() {
  const { mutate } = useOptimisticMutation<Category[], Category>({
    mutationFn: (category: Category) => addCategory(category),
    queryKey: [QUERY_KEYS.categories],
    updater: (prev, category) => prev?.concat(category),
  })
  return mutate
}

export function useCategoryDelete() {
  const { mutate } = useOptimisticMutation<Category[], string>({
    mutationFn: (id: string) => deleteCategory(id),
    queryKey: [QUERY_KEYS.categories],
    updater: (prev, id) => prev?.filter((item) => item._id !== id),
  })
  return mutate
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

//------------
// BODYWEIGHT
//------------

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
