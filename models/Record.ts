import dayjs from 'dayjs'
import { Filter } from 'mongodb'
import { z } from 'zod'
import { DATE_FORMAT } from '../lib/frontend/constants'
import {
  generateId,
  removeUndefinedKeys,
  stringOrArraySchema,
  toArray,
} from '../lib/util'
import { exerciseSchema } from './AsyncSelectorOption/Exercise'
import { noteSchema } from './Note'
import { DEFAULT_SET_TYPE, setSchema, setTypeSchema } from './Set'
import {
  ArrayMatchType,
  buildMatchTypeFilter,
} from './query-filters/ArrayMatchType'
import DateRangeQuery from './query-filters/DateRangeQuery'

// todo: add activeCategory (for programming)
export interface Record extends z.infer<typeof recordSchema> {}
export const recordSchema = z.strictObject({
  _id: z.string(),
  date: z.string(),
  exercise: exerciseSchema.nullable(),
  activeModifiers: z.array(z.string()),
  category: z.string().nullable(),
  notes: z.array(noteSchema),
  setType: setTypeSchema,
  sets: z.array(setSchema),
})

export const createRecord = (
  date: string,
  {
    exercise = null,
    activeModifiers = [],
    category = null,
    notes = [],
    sets = [],
    setType = DEFAULT_SET_TYPE,
  }: Partial<Record> = {}
): Record => ({
  _id: generateId(),
  date,
  exercise,
  activeModifiers,
  category,
  notes,
  sets,
  setType,
})

/** Record queries may include a date range, which must be parsed separately */
export type RecordRangeQuery = z.input<typeof recordQuerySchema> &
  DateRangeQuery
export const recordQuerySchema = z
  .object({
    exercise: z.string(),
    modifier: stringOrArraySchema,
    modifierMatchType: z.nativeEnum(ArrayMatchType),
    // todo: refactor MatchType to remove Any. Any is just "don't pass in the fields"
    setTypeMatchType: z.nativeEnum(ArrayMatchType),
  })
  .partial()
  // turn off strictObject
  .and(setTypeSchema.strip().partial())
  .transform(
    ({
      exercise,
      modifier,
      modifierMatchType,
      setTypeMatchType,
      field,
      operator,
      value,
      min,
      max,
      ...rest
    }) => {
      const setTypeFields =
        setTypeMatchType !== ArrayMatchType.Any
          ? {
              'setType.field': field,
              'setType.operator': operator,
              'setType.value': value,
              'setType.min': min,
              'setType.max': max,
            }
          : {}
      const filter: Filter<Record> = {
        ...rest,
        ...setTypeFields,
        'exercise.name': exercise,
        activeModifiers: buildMatchTypeFilter(
          toArray(modifier),
          modifierMatchType
        ),
      }

      return removeUndefinedKeys(filter)
    }
  )

export const DEFAULT_RECORD_HISTORY_QUERY: RecordRangeQuery = {
  exercise: '',
  modifier: [],
  modifierMatchType: ArrayMatchType.Partial,
  setTypeMatchType: ArrayMatchType.Any,
  end: dayjs().format(DATE_FORMAT),
  limit: 100,
  ...DEFAULT_SET_TYPE,
}
