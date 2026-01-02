import dayjs from 'dayjs'
import { DATE_FORMAT } from '../lib/frontend/constants'
import { generateId } from '../lib/id'
import { removeUndefinedKeys } from '../lib/util/object'
import { ArrayMatchType, buildMatchTypeFilter } from './ArrayMatchType'
import type FetchOptions from './FetchOptions'
import type { Note } from './Note'
import { DEFAULT_SET_TYPE, type Set, type SetType } from './Set'

export interface Record {
  _id: string
  date: string
  exerciseId: string
  activeModifiers: string[]
  notes: Note[]
  setType: SetType
  sets: Set[]
}

export const createRecord = (
  date: string,
  exerciseId: string,
  {
    activeModifiers = [],
    notes = [],
    sets = [{}],
    setType = DEFAULT_SET_TYPE,
  }: Partial<Record> = {}
): Record => ({
  _id: generateId(),
  date,
  exerciseId,
  activeModifiers,
  notes,
  sets,
  setType,
})

export interface RecordQuery extends FetchOptions {
  exerciseId?: string
  modifiers?: string[]
  modifierMatchType?: ArrayMatchType
  setType?: Partial<SetType>
  setTypeMatchType?: ArrayMatchType
  date?: string
}

export const buildRecordFilter = ({
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
    activeModifiers: buildMatchTypeFilter(modifiers, modifierMatchType),
    ...setTypeFields,
    ...rest,
  })
}

export const DEFAULT_RECORD_HISTORY_QUERY: RecordQuery = {
  modifiers: [],
  modifierMatchType: ArrayMatchType.Partial,
  setType: DEFAULT_SET_TYPE,
  setTypeMatchType: ArrayMatchType.Any,
  end: dayjs().format(DATE_FORMAT),
  limit: 100,
}

export const isRecord = (thing: unknown): thing is Record =>
  !!thing && typeof thing === 'object' && 'activeModifiers' in thing
