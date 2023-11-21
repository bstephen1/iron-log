import { TextFieldProps } from '@mui/material'
import { AsyncSelectorProps } from 'components/form-fields/selectors/AsyncSelector'
import ExerciseSelector from 'components/form-fields/selectors/ExerciseSelector'
import { useExercises } from 'lib/frontend/restService'
import { UpdateFields } from 'lib/util'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import Record from 'models/Record'
import { Status } from 'models/Status'
import { memo } from 'react'
import isEqual from 'react-fast-compare'

type Props = {
  mutateRecordFields: UpdateFields<Record>
  disableAddNew?: boolean
  variant?: TextFieldProps['variant']
} & Pick<Record, 'activeModifiers' | 'category' | 'exercise'> &
  Partial<AsyncSelectorProps<Exercise>>
export default memo(function RecordExerciseSelector({
  mutateRecordFields,
  activeModifiers,
  category,
  exercise,
  disableAddNew,
  variant,
  ...asyncSelectorProps
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
      variant={variant ?? 'standard'}
      category={category}
      handleCategoryChange={(category) => mutateRecordFields({ category })}
      {...{
        exercise,
        exercises,
        handleChange,
        mutate: disableAddNew ? undefined : mutateExercises,
      }}
      {...asyncSelectorProps}
    />
  )
},
isEqual)
