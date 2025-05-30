import { z } from 'zod'
import { generateId } from '../lib/util'
import { type Note, noteSchema } from './Note'
import { type Record } from './Record'
import { dateSchema, idSchema } from './schemas'

// todo: add session time. start time: first set created. end time: last update to a set on the same day.
export interface SessionLog extends z.infer<typeof sessionLogSchema> {}
export const sessionLogSchema = z.object({
  _id: idSchema,
  /** YYYY-MM-DD */
  date: dateSchema,
  /** An ordered array of associated Record ids */
  records: z.array(z.string()),
  /** session notes that are visible to all records in the session */
  notes: z.array(noteSchema),
})

export const createSessionLog = (
  date: string,
  records: Record['_id'][] = [],
  notes: Note[] = []
): SessionLog => ({
  _id: generateId(),
  date,
  records,
  notes,
})
