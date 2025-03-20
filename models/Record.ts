import { z } from 'zod'
import { generateId } from '../lib/util'
import { Exercise, exerciseSchema } from './AsyncSelectorOption/Exercise'
import { Note, noteSchema } from './Note'
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

export const recordSchema = z.object({
  _id: z.string(),
  date: z.string(),
  exercise: exerciseSchema.nullable(),
  activeModifiers: z.array(z.string()),
  category: z.string().nullable(),
  notes: z.array(noteSchema),
  setType: z.object({
    field: z.string(),
    // field: z.string().refine((field) => Object.keys(Set).includes(field)),
    // we could do z.enum(setOperators), but then it would have to be defined above this,
    // and for clarity we want the record definition at the top of the file.
    operator: z
      .string()
      .refine((operator) => setOperators.includes(operator as SetOperator)),
    value: z.number().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
  }),
  sets: z.array(
    z.object({
      reps: z.number(),
      weight: z.number().nullable(),
      rest: z.number().nullable(),
    })
  ),
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
