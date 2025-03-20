import { z } from 'zod'
import { generateId } from '../lib/util'
import { exerciseSchema } from './AsyncSelectorOption/Exercise'
import { noteSchema } from './Note'
import { DEFAULT_SET_TYPE, setSchema, setTypeSchema } from './Set'

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
