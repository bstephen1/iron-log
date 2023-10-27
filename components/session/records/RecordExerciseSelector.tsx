import ExerciseSelector from 'components/form-fields/selectors/ExerciseSelector'
import { useExercises } from 'lib/frontend/restService'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import { Status } from 'models/Status'
import useCurrentRecord from './useCurrentRecord'

export default function RecordExerciseSelector() {
  const { activeModifiers, category, exercise, updateFields } =
    useCurrentRecord()
  const { exercises, mutate: mutateExercises } = useExercises({
    status: Status.active,
  })

  const handleChange = async (newExercise: Exercise | null) => {
    // if an exercise changes, discard any modifiers that are not valid for the new exercise
    const remainingModifiers = activeModifiers.filter((modifier) =>
      newExercise?.modifiers.some((exercise) => exercise === modifier)
    )

    updateFields({
      exercise: newExercise,
      activeModifiers: remainingModifiers,
    })
  }

  return (
    <ExerciseSelector
      variant="standard"
      category={category}
      handleCategoryChange={(category) => updateFields({ category })}
      {...{
        exercise,
        exercises,
        handleChange,
        mutate: mutateExercises,
      }}
    />
  )
}
