import { generateId } from '../lib/util/id'
import type { Note } from './Note'

// todo: add session time. start time: first set created. end time: last update to a set on the same day.
export interface SessionLog {
  _id: string
  /** YYYY-MM-DD */
  date: string
  /** An ordered array of associated Record ids */
  records: string[]
  /** session notes that are visible to all records in the session */
  notes: Note[]
}

export const createSessionLog = (
  date: string,
  records: string[] = [],
  notes: Note[] = []
): SessionLog => ({
  _id: generateId(),
  date,
  records,
  notes,
})
