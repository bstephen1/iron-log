import { useQueryState } from 'next-usequerystate'
import { useCallback, useState } from 'react'
import {
  updateExerciseFields,
  useExercises,
} from '../../lib/frontend/restService'
import Exercise from '../../models/AsyncSelectorOption/Exercise'
import ManageWelcomeCard from '../ManageWelcomeCard'
import ExerciseSelector from '../form-fields/selectors/ExerciseSelector'
import ExerciseForm from './ExerciseForm'

// todo: ui element showing "changes saved". Snackbar?
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
      // setQueryState will rerender the entire page if setting to the same value
      if (updates.name) {
        setUrlExercise(updates.name)
      }

      mutateExercises(
        async (cur) => {
          const oldExercise = cur?.find((e) => e._id === id)
          if (!oldExercise) {
            return cur
          }

          const updatedExercise = await updateExerciseFields(
            oldExercise,
            updates,
          )
          return cur?.map((e) =>
            e._id === updatedExercise._id ? updatedExercise : e,
          )
        },
        // todo: is there a way to simplify the duplicate code?
        // The optimisticData should theoretically be useful if updateExerciseFields() is slow
        {
          optimisticData: (cur) => {
            if (!cur) return []

            const oldExercise = cur.find((e) => e._id === id)
            if (!oldExercise) {
              return cur
            }

            return cur.map((e) =>
              e._id === oldExercise._id ? { ...oldExercise, ...updates } : e,
            )
          },
        },
      )
    },
    [setUrlExercise, mutateExercises],
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
