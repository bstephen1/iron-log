import ExerciseSelector from 'components/form-fields/selectors/ExerciseSelector'
import { useExercises } from 'lib/frontend/restService'
import { UpdateFields } from 'lib/util'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import Record from 'models/Record'
import { Status } from 'models/Status'
import { memo } from 'react'

interface Props
  extends Pick<Record, 'activeModifiers' | 'category' | 'exercise'> {
  mutateRecordFields: UpdateFields<Record>
}
export default memo(function RecordExerciseSelector({
  mutateRecordFields,
  activeModifiers,
  category,
  exercise,
}: Props) {
  const { exercises, mutate: mutateExercises } = useExercises({
    status: Status.active,
  })

  const handleChange = async (newExercise: Exercise | null) => {
    // if an exercise changes, discard any modifiers that are not valid for the new exercise
    const remainingModifiers = activeModifiers.filter((modifier) =>
      newExercise?.modifiers.some((exercise) => exercise === modifier)
    )

    mutateRecordFields({
      exercise: newExercise,
      activeModifiers: remainingModifiers,
    })
  }

  return (
    <ExerciseSelector
      variant="standard"
      category={category}
      handleCategoryChange={(category) => mutateRecordFields({ category })}
      {...{
        exercise,
        exercises,
        handleChange,
        mutate: mutateExercises,
      }}
    />
  )
})
