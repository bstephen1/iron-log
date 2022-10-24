export enum ExerciseStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

// could store the status as an int and translate to a string on the frontend
// that would make it harder to update sort order later though...
export const ExerciseStatusOrder = {
  [ExerciseStatus.ACTIVE]: 1,
  [ExerciseStatus.ARCHIVED]: 2,
}
