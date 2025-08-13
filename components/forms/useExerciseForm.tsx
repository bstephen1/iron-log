import { useQueryState } from 'nuqs'
import { useCallback, useState } from 'react'
import { useExercises } from '../../lib/frontend/restService'
import { type Exercise } from '../../models/AsyncSelectorOption/Exercise'
import ManageWelcomeCard from '../ManageWelcomeCard'
import ExerciseSelector from '../form-fields/selectors/ExerciseSelector'
import ExerciseForm from './ExerciseForm'
import { updateExerciseFields } from '../../lib/backend/mongoService'

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

  // We need to avoid using "exercise" or this function will always trigger child rerenders,
  // so we isolate using it within the mutate callbacks.
  const handleUpdate = useCallback(
    async (id: string, updates: Partial<Exercise>) => {
      const updatedExercise = await updateExerciseFields(id, updates)
      // setQueryState will rerender the entire page if setting to the same value
      if (updates.name) {
        setUrlExercise(updates.name)
      }

      mutateExercises(async (cur) =>
        cur?.map((exercise) =>
          exercise._id === id ? updatedExercise : exercise
        )
      )
    },
    [setUrlExercise, mutateExercises]
  )

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
    Form: exercise ? (
      <ExerciseForm {...{ exercise, handleUpdate }} />
    ) : (
      <ManageWelcomeCard />
    ),
  }
}
