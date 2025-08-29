import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
  type MutationFunction,
  type QueryKey,
} from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { stringify, type ParsedUrlQueryInput } from 'querystring'
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
  recordQuerySchema,
  type Record,
  type RecordRangeQuery,
} from '../../models/Record'
import { createSessionLog, type SessionLog } from '../../models/SessionLog'
import {
  addCategory,
  addExercise,
  addModifier,
  addRecord,
  deleteCategory,
  deleteExercise,
  deleteModifier,
  deleteRecord,
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
  updateRecordFields,
  upsertBodyweight,
  upsertSessionLog,
} from '../backend/mongoService'
import { DATE_FORMAT, QUERY_KEYS } from './constants'

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
/** Parse a Query object into a rest param string. Query objects should be spread into this function. */
export const paramify = (query: ParsedUrlQueryInput) => {
  const parsedQuery: ParsedUrlQueryInput = {}
  for (const [key, value] of Object.entries(query)) {
    // stringify() adds empty strings to the url param, which can cause unintended behavior.
    // Generally the presence of a query param indicates truthiness, whereas an empty string indicates a falsy value.
    if (!value) continue

    // note: stringify() drops empty arrays.
    // See: https://github.com/psf/requests/issues/6557
    parsedQuery[key] = value
  }
  // note that stringify doesn't add the leading '?'.
  // See documentation: https://nodejs.org/api/querystring.html#querystringstringifyobj-sep-eq-options
  return '?' + stringify(parsedQuery)
}

const toNames = (entities?: AsyncSelectorOption[]) =>
  entities?.map((entity) => entity.name) ?? []

const nameSort = <T extends { name: string }>(data?: T[]) =>
  data?.sort((a, b) => a.name.localeCompare(b.name)) ?? []

type OptimisticProps<
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
}: OptimisticProps<TQueryFnData, TData, TVariables>) => {
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
    queryFn: () => fetchSessionLog(undefined, date),
  })
}

export function useSessionLogs(query: DateRangeQuery) {
  const hook = useQuery({
    queryKey: [QUERY_KEYS.sessionLogs, query],
    queryFn: () => fetchSessionLogs(undefined, query),
  })

  return {
    ...hook,
    index: arrayToIndex('date', hook.data),
  }
}

export function useSessionLogUpsert(date: string) {
  const { mutate } = useOptimisticMutation({
    mutationFn: upsertSessionLog,
    queryKey: [QUERY_KEYS.sessionLogs, date],
    updater: (_, sessionLog) => sessionLog,
  })
  return mutate
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
    queryFn: () => fetchRecords(undefined, filter, dateFilter),
    enabled,
  })

  return {
    ...hook,
    index: arrayToIndex('_id', hook.data),
  }
}

export function useRecordUpdate(date: string) {
  const { mutate } = useOptimisticMutation<
    Record[],
    Record,
    {
      _id: string
      updates: Partial<Record>
    }
  >({
    mutationFn: ({ _id, updates }) => updateRecordFields(_id, updates),
    queryKey: [QUERY_KEYS.records, { date }],
    updater: (prev, { _id, updates }) =>
      prev?.map((rec) => (rec._id === _id ? { ...rec, ...updates } : rec)),
  })
  return mutate
}

export function useRecordAdd(date: string) {
  const queryClient = useQueryClient()
  const { mutate } = useOptimisticMutation<Record[], Record>({
    mutationFn: (record: Record) => addRecord(record),
    queryKey: [QUERY_KEYS.records, { date }],
    updater: (prev = [], record) => {
      queryClient.setQueryData<SessionLog>(
        [QUERY_KEYS.sessionLogs, date],
        (prev) =>
          createSessionLog(date, prev?.records.concat(record._id), prev?.notes)
      )

      return [...prev, record]
    },
    invalidates: [QUERY_KEYS.sessionLogs],
  })
  return mutate
}

export function useRecordDelete(date: string) {
  const queryClient = useQueryClient()

  const { mutate } = useOptimisticMutation<Record[], string>({
    mutationFn: (id: string) => deleteRecord(id),
    queryKey: [QUERY_KEYS.records, { date }],
    updater: (prev, id) => {
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

      return prev?.filter((item) => item._id !== id)
    },
    invalidates: [QUERY_KEYS.sessionLogs],
  })
  return mutate
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
    mutationFn: ({ _id, name, updates }) => updateCategoryFields(_id, updates),
    queryKey: [QUERY_KEYS.categories],
    updater: (prev, { _id, updates }) =>
      prev?.map((cat) => (cat._id === _id ? { ...cat, ...updates } : cat)),
    invalidates: ['exercises'],
    // todo: not working
    // if (updates.name) {
    //   queryClient.setQueryData<Exercise[]>(['exercises'], (prev) =>
    //     prev?.map((ex) => ({
    //       ...ex,
    //       categories: ex.categories.map((cat) =>
    //         cat === name ? (updates.name as string) : cat
    //       ),
    //     }))
    //   )
    // }
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
    queryFn: () => fetchBodyweights(undefined, filter, dateQuery),
    enabled,
  })

  return {
    data: enabled ? data : [],
    ...rest,
  }
}

export function useBodyweightUpsert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsertBodyweight,
    // make sure to _return_ the Promise from the query invalidation
    // so that the mutation stays in `pending` state until the refetch is finished
    onSettled: async () =>
      await queryClient.invalidateQueries({
        // Marks as stale any cache data that includes the queryKey (NOT exact).
        // Could potentially tighten this to only keys with end date less than the
        // new bw's date, but probably wouldn't make any noticeable improvement
        queryKey: [QUERY_KEYS.bodyweights],
      }),
  })
}
