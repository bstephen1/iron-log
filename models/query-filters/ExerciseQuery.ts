import { ExerciseStatus } from '../ExerciseStatus'

export interface ExerciseQuery {
  status?: ExerciseStatus
  /** Note: the api param is "category" because when filtering only one category is supported.
   * But the query must stay as "categories" to match Exercise objects.
   */
  categories?: string
  name?: string
}
