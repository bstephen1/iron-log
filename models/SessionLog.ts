import { z } from 'zod'
import { generateId } from '../lib/util'
import { Note, noteSchema } from './Note'
import { Record } from './Record'

// todo: add session time. Start / end times? Program stuff (not hashed out yet), overall notes?
// todo: gym location?
export interface SessionLog extends z.infer<typeof sessionLogSchema> {}
export const sessionLogSchema = z.object({
  _id: z.string(),
  /** YYYY-MM-DD */
  date: z.string().date(),
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
