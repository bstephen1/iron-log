import { generateId } from '../lib/util'
import { Note } from './Note'
import { Record } from './Record'

// todo: add session time. Start / end times? Program stuff (not hashed out yet), overall notes?
// todo: gym location?
export interface SessionLog {
  _id: string
  date: string
  /** An ordered array of associated Record ids */
  records: Record['_id'][]
  /** session notes that are visible to all records in the session */
  notes: Note[]
}

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
