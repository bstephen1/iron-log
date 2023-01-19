import { ExerciseStatus } from '../ExerciseStatus'

export interface ExerciseQuery {
  status?: ExerciseStatus
  category?: string
  exercise?: {
    name?: string
  }
}
