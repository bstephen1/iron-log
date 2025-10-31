import dayjs from 'dayjs'
import { DATE_FORMAT } from '../lib/frontend/constants'
import { generateId } from '../lib/id'
import { removeUndefinedKeys } from '../lib/util/object'
import { ArrayMatchType, buildMatchTypeFilter } from './ArrayMatchType'
import type { Exercise } from './AsyncSelectorOption/Exercise'
import type FetchOptions from './FetchOptions'
import type { Note } from './Note'
import { DEFAULT_SET_TYPE, type Set, type SetType } from './Set'

// todo: add activeCategory (for programming)
export interface Record {
  _id: string
  date: string
  /** usually a record should always have an exercise, but in some cases the exercise can become null.
   *  Eg, swapping category to a category not valid for the current exercise.
   */
  exercise?: Exercise | null
  activeModifiers: string[]
  category?: string | null
  notes: Note[]
  setType: SetType
  sets: Set[]
}

export const createRecord = (
  date: string,
  {
    exercise = null,
    activeModifiers = [],
    category = null,
    notes = [],
    sets = [{}],
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

export interface RecordQuery extends FetchOptions {
  exercise?: string
  category?: string
  modifiers?: string[]
  modifierMatchType?: ArrayMatchType
  setType?: Partial<SetType>
  setTypeMatchType?: ArrayMatchType
  date?: string
}

export const buildRecordFilter = ({
  exercise,
  modifiers,
  modifierMatchType,
  setType: { field, operator, value, min, max } = {},
  setTypeMatchType,
  ...rest
}: RecordQuery = {}) => {
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

  return removeUndefinedKeys({
    'exercise.name': exercise,
    activeModifiers: buildMatchTypeFilter(modifiers, modifierMatchType),
    ...setTypeFields,
    ...rest,
  })
}

export const DEFAULT_RECORD_HISTORY_QUERY: RecordQuery = {
  exercise: '',
  modifiers: [],
  modifierMatchType: ArrayMatchType.Partial,
  setType: DEFAULT_SET_TYPE,
  setTypeMatchType: ArrayMatchType.Any,
  end: dayjs().format(DATE_FORMAT),
  limit: 100,
}

export const isRecord = (thing: unknown): thing is Record =>
  !!thing && typeof thing === 'object' && 'activeModifiers' in thing
