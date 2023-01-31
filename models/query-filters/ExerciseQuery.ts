import { Status } from '../Status'

export default interface ExerciseQuery {
  status?: Status

  /** Same as category. Queries for exercises with any one of the given categories. */
  categories?: string[]
  /** Same as "categories". Provided for convenience in the rest api.
   *  "category" gets treated as and merged with "categories" on the backend.
   *
   * Queries for exercises with any one of the given categories.
   */
  category?: string[]
  name?: string
}
