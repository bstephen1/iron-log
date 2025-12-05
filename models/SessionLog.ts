import { generateId } from '../lib/id'
import type { Note } from './Note'

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
