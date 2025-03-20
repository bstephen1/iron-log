import { z } from 'zod'
import { generateId } from '../lib/util'
import { Exercise, exerciseSchema } from './AsyncSelectorOption/Exercise'
import { Note, noteSchema } from './Note'
import { DEFAULT_SET_TYPE, Set, setOperators, SetType } from './Set'

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
    operator: z.enum(setOperators),
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
