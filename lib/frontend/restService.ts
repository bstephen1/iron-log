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
  DATE_FORMAT,
  URI_BODYWEIGHT,
  URI_CATEGORIES,
  URI_EXERCISES,
  URI_MODIFIERS,
  URI_RECORDS,
  URI_SESSIONS,
} from './constants'
import { fetchExercises } from '../backend/mongoService'

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
  // const { data: tanstackData } = useQuery({
  //   queryKey: ['exercises'],
  //   queryFn: fetchExercises,
  // })

  // so the way useSWR works is it takes a KEY and a FETCHER,
  // and it then calls fetcher(key). KEY must be serializable (ie, a string)
  // because that is the object key it uses to create its cache map.
  // So here 'api/exercises' must be unique to the useExercises hook because
  // it will store that data in the cache.
  // We can hack around needing an api endpoint by passing a server function
  // which takes no args as the FETCHER, and then give the desired KEY
  // (which will have no effect on the no-arg function)
  const { data, mutate } = useSWR<Exercise[], ApiError>(
    URI_EXERCISES,
    fetchExercises
  )
  const sortedData = nameSort(data as Exercise[])
  console.log(data)

  return {
    exercises: sortedData,
    exerciseNames: toNames(sortedData),
    mutate,
  }
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

export function useModifiers() {
  const { data, mutate } = useSWR<Modifier[], ApiError>(URI_MODIFIERS)
  const sortedData = nameSort(data)

  return {
    modifiers: sortedData,
    modifiersIndex: arrayToIndex<Modifier>('name', data),
    modifierNames: toNames(sortedData),

    mutate,
  }
}

//----------
// CATEGORY
//----------

export function useCategories() {
  const { data, mutate } = useSWR<Category[], ApiError>(URI_CATEGORIES)
  const sortedData = nameSort(data)

  return {
    categories: sortedData,
    categoryNames: toNames(sortedData),
    mutate,
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
