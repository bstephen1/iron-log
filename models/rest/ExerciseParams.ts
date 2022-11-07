import { ExerciseStatus } from '../ExerciseStatus'

// valid params to use in the API call.
export interface ExerciseParams {
  status?: ExerciseStatus
  category?: string
  name?: string
}
