import { Status } from '../Status'
import { ArrayMatchType } from './MongoQuery'

export interface ExerciseQueryFrontend {
  status?: Status
  /** Query on categories. Can provide multiple categories. */
  category?: string[]
  /** Specify how to match against the given category array. Defaults to "Exact" */
  categoryMatchType?: ArrayMatchType
  name?: string
}

/** This model must match what mongo expects for Filter<Exercise>  */
export interface ExerciseQueryBackend {
  status?: Status
  categories?: string[]
  name?: string
}
