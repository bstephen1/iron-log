import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type MutationFunction,
  type QueryKey,
} from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'
import { stringify, type ParsedUrlQueryInput } from 'querystring'
import useSWR from 'swr'
import { arrayToIndex } from '../../lib/util'
import type DateRangeQuery from '../../models//DateRangeQuery'
import { type ApiError } from '../../models/ApiError'
import { type AsyncSelectorOption } from '../../models/AsyncSelectorOption'
import { type Category } from '../../models/AsyncSelectorOption/Category'
import { type Exercise } from '../../models/AsyncSelectorOption/Exercise'
import { type Modifier } from '../../models/AsyncSelectorOption/Modifier'
import {
  type Bodyweight,
  type BodyweightRangeQuery,
} from '../../models/Bodyweight'
import { type Record, type RecordRangeQuery } from '../../models/Record'
import { type SessionLog } from '../../models/SessionLog'
import {
  addCategory,
  addExercise,
  addModifier,
  deleteCategory,
  deleteExercise,
  deleteModifier,
  fetchCategories,
  fetchExercises,
  fetchModifiers,
  updateCategoryFields,
  updateExerciseFields,
  updateModifierFields,
} from '../backend/mongoService'
import {
  DATE_FORMAT,
  QUERY_KEYS,
  URI_BODYWEIGHT,
  URI_EXERCISES,
  URI_RECORDS,
  URI_SESSIONS,
} from './constants'

// Note: make sure any fetch() functions actually return after the fetch!
// Otherwise there's no guarantee the write will be finished before it tries to read again...

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
  const { data, isLoading, mutate } = useSWR<SessionLog | null, ApiError>(
    URI_SESSIONS + (typeof day === 'string' ? day : day.format(DATE_FORMAT))
  )

  return {
    sessionLog: data,
    isLoading,
    mutate,
  }
}

export function useSessionLogs(query: DateRangeQuery) {
  const { data, isLoading, mutate } = useSWR<SessionLog[], ApiError>(
    URI_SESSIONS + paramify({ ...query })
  )

  return {
    sessionLogs: data,
    sessionLogsIndex: arrayToIndex<SessionLog>('date', data),
    isLoading,

    mutate,
  }
}

//--------
// RECORD
//--------

/** Note: whenever mutate() is used, any component using useRecord will rerender, even if they don't
 *  use the record from this hook. This can be avoided by lifting the full record to a lightweight parent
 *  component and only passing the fields actually needed as props. If the child needs access to mutate(),
 *  it can either take the mutate from this hook as another prop, or use the global mutate from useSWRConfig().
 *
 *  Note that this applies to any other useSWR hook as well.
 */
export function useRecord(id: string) {
  const { data, isLoading, mutate } = useSWR<Record | null, ApiError>(
    URI_RECORDS + id
  )

  return {
    record: data ?? null,
    isLoadingRecord: isLoading,
    // todo: mutate => mutateRecord ? Hard to wrangle with multiple mutates
    mutate,
  }
}

export function useRecords(
  query?: RecordRangeQuery & DateRangeQuery,
  shouldFetch = true
) {
  const { data, isLoading, mutate } = useSWR<Record[], ApiError>(
    shouldFetch ? URI_RECORDS + paramify({ ...query }) : null
  )

  return {
    // data will be undefined forever if the fetch is null
    records: shouldFetch ? data : [],
    recordsIndex: shouldFetch ? arrayToIndex<Record>('_id', data) : {},

    mutate,
    isLoading,
  }
}

//----------
// EXERCISE
//----------

export function useExercises() {
  const { data, ...rest } = useSuspenseQuery({
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

export function useExercise(
  /** fetching will be disabled if id is falsy   */
  id?: string | null
) {
  const { data, isLoading, mutate } = useSWR<Exercise | null, ApiError>(
    // Passing null to useSWR disables fetching.
    // NOTE: when fetching is disabled useSWR returns data as undefined, not null
    id ? URI_EXERCISES + id : null
  )

  return {
    exercise: data ?? null,
    isLoadingExercise: isLoading,
    mutate,
  }
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

export function useModifiers() {
  const { data, ...rest } = useSuspenseQuery({
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

export function useCategories() {
  const { data, ...rest } = useSuspenseQuery({
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

export function useBodyweights(
  query?: BodyweightRangeQuery,
  shouldFetch = true
) {
  // bodyweight history is stored as ISO8601, so we need to add a day.
  // 2020-04-02 sorts as less than 2020-04-02T08:02:17-05:00 since there are less chars.
  // Incrementing to 2020-04-03 will catch everything from the previous day.
  const addDay = (date: string) => dayjs(date).add(1, 'day').format(DATE_FORMAT)

  const start = query?.start ? addDay(query.start) : undefined
  const end = query?.end ? addDay(query.end) : undefined

  const { data, mutate } = useSWR<Bodyweight[], ApiError>(
    shouldFetch ? URI_BODYWEIGHT + paramify({ start, end, ...query }) : null
  )

  return {
    data: shouldFetch ? data : [],

    mutate,
  }
}
