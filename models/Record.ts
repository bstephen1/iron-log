import { generateId } from '../lib/util'
import Exercise from './Exercise'
import Note from './Note'
import { Set } from './Set'

// todo: add activeCategory (for programming)
export default class Record {
  exercise: Exercise | null
  activeModifiers: string[]
  category: string | null
  notes: Note[]
  sets: Set[]
  readonly _id: string
  constructor(public date: string, record: Partial<Record>) {
    this.exercise = record.exercise || null
    this.activeModifiers = record.activeModifiers || []
    this.category = record.category || ''
    this.notes = record.notes || []
    this.sets = record.sets || []
    this._id = generateId()
  }
}
