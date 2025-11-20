import type { Exercise } from '../../models/AsyncSelectorOption/Exercise'

/** returns the exercises the given category or modifier is used in */
export const getUsage = (
  exercises: Exercise[],
  field: keyof Pick<Exercise, 'categories' | 'modifiers'>,
  name: string
) => exercises.filter((exercise) => exercise[field].includes(name))
