import { Status } from '../../models/Status'
import { ArrayMatchType } from './ArrayMatchType'

export interface ExerciseQuery {
  status?: Status
  /** Query on categories. Can provide multiple categories. */
  category?: string[]
  /** Specify how to match against the given category array. Defaults to "Exact" */
  categoryMatchType?: ArrayMatchType
  name?: string
}
