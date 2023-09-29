import ExerciseForm from 'components/ExerciseForm'
import ExerciseSelector from 'components/form-fields/selectors/ExerciseSelector'
import ManageWelcomeCard from 'components/ManageWelcomeCard'
import { updateExerciseFields, useExercises } from 'lib/frontend/restService'
import Exercise from 'models/Exercise'
import { useQueryState } from 'next-usequerystate'
import { useState } from 'react'

// todo: delete exercise. Delete only for unused exercises?
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

  const handleUpdate = async (updates: Partial<Exercise>) => {
    if (!exercise) return

    const newExercise = { ...exercise, ...updates }
    setUrlExercise(newExercise.name, { scroll: false, shallow: true })

    mutateExercises(
      async () => {
        const updatedExercise = await updateExerciseFields(exercise, updates)
        return exercises?.map((exercise) =>
          exercise._id === updatedExercise._id ? updatedExercise : exercise
        )
      },
      {
        optimisticData: updates.name
          ? [...(exercises ?? []), newExercise]
          : undefined,
      }
    )
  }

  return {
    Selector: (
      <ExerciseSelector
        {...{
          exercise,
          handleChange: (exercise) => {
            setUrlExercise(exercise?.name ?? null, {
              scroll: false,
              shallow: true,
            })
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
