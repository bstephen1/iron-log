import { generateId } from '../lib/util'
import { Exercise } from './AsyncSelectorOption/Exercise'
import { Note } from './Note'
import { Set } from './Set'

// todo: add activeCategory (for programming)
export interface Record {
  _id: string
  date: string
  exercise: Exercise | null
  activeModifiers: string[]
  category: string | null
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

/** Marks the structure of the set in a record. Reads as <operator> <value|range> <field>.
 *  Eg, "exactly 5 reps" means every set in the record is supposed to have 5 reps.
 *
 * Records with the same SetType are grouped together when pulling history so progress can be tracked.
 */
export interface SetType {
  field: keyof Set
  operator: SetOperator
  value?: number
  /** used for "between" operator */
  min?: number
  /** used for "between" operator */
  max?: number
}

export type SetOperator = (typeof setOperators)[number]
export const setOperators = [
  'exactly',
  'at most',
  'at least',
  'between',
  'total',
  'rest',
] as const

export const DEFAULT_SET_TYPE: SetType = {
  operator: 'exactly',
  value: 6,
  field: 'reps',
}
