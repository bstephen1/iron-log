import { useQueryState } from 'nuqs'
import { useState } from 'react'
import { useExercises } from '../../lib/frontend/restService'
import ManageWelcomeCard from '../ManageWelcomeCard'
import ExerciseSelector from '../form-fields/selectors/ExerciseSelector'
import ExerciseForm from './ExerciseForm'

export default function useExerciseForm() {
  const [urlExercise, setUrlExercise] = useQueryState('exercise')
  const { exercises, mutate: mutateExercises } = useExercises()
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  const unfilteredExercise =
    exercises?.find((exercise) => exercise.name === urlExercise) ?? null

  const exercise =
    categoryFilter && !unfilteredExercise?.categories.includes(categoryFilter)
      ? null
      : unfilteredExercise

  return {
    Selector: (
      <ExerciseSelector
        {...{
          exercise,
          handleChange: (exercise) => {
            setUrlExercise(exercise?.name ?? null)
          },
          exercises,
          mutate: mutateExercises,
          alwaysShowLoading: true,
          category: categoryFilter,
          handleCategoryChange: setCategoryFilter,
        }}
      />
    ),
    Form: exercise ? <ExerciseForm {...{ exercise }} /> : <ManageWelcomeCard />,
  }
}
