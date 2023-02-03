import { ArrayMatchType } from './MongoQuery'

export interface RecordQuery {
  /** YYYY-MM-DD */
  date?: string
  /** Exercise name.  */
  exercise?: string
  /** Queries for any Record that contains a set with the given reps */
  reps?: number
  /** Active modifier names */
  modifier?: string[]
  /** Specify how to match against the given modifiers array. Defaults to "Exact" */
  modifierMatchType?: ArrayMatchType
}
