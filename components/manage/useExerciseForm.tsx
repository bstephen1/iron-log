import ExerciseForm from 'components/ExerciseForm'
import ExerciseSelector from 'components/form-fields/selectors/ExerciseSelector'
import ManageWelcomeCard from 'components/ManageWelcomeCard'
import { useExercises } from 'lib/frontend/restService'
import Exercise from 'models/Exercise'
import { useQueryState } from 'next-usequerystate'
import { useEffect, useState } from 'react'

// todo: delete exercise. Delete only for unused exercises?
// todo: ui element showing "changes saved". Snackbar?
export default function useExerciseForm() {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [urlExercise, setUrlExercise] = useQueryState('exercise')
  const { exercises, mutate: mutateExercises } = useExercises()
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  // setup initial state values when SWR is done loading if a url value exists
  // Note: exercise state must update when a category/modifier name is updated.
  // This happens implicitly as long as each form is not kept in dom when not active,
  // since the form will re-init and run through this useEffect when it becomes active.
  useEffect(() => {
    if (!!exercise || !exercises || !urlExercise) return

    const initialExercise =
      exercises.find((exercise) => exercise.name === urlExercise) ?? null

    // Only set if exercise is valid given the category filter.
    // This prevents an infinite loop of trying to set exercise then having it null out from categoryFilter
    if (categoryFilter) {
      setExercise(
        initialExercise?.categories.includes(categoryFilter)
          ? initialExercise
          : null
      )
    } else {
      setExercise(initialExercise)
    }
  }, [categoryFilter, exercise, exercises, urlExercise])

  const onExerciseUpdate = async (newExercise: Exercise) => {
    setUrlExercise(newExercise.name, { scroll: false, shallow: true })
    setExercise(newExercise)
  }

  return {
    Selector: (
      <ExerciseSelector
        {...{
          exercise,
          handleChange: (exercise) => {
            setExercise(exercise)
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
      <ExerciseForm
        {...{ initialExercise: exercise, onUpdate: onExerciseUpdate }}
      />
    ) : (
      <ManageWelcomeCard />
    ),
  }
}
