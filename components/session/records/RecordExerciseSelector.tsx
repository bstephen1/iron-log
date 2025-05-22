import { memo } from 'react'
import isEqual from 'react-fast-compare'
import { type AsyncSelectorProps } from '../../../components/form-fields/selectors/AsyncSelector'
import ExerciseSelector from '../../../components/form-fields/selectors/ExerciseSelector'
import { useExercises } from '../../../lib/frontend/restService'
import { type UpdateFields } from '../../../lib/util'
import { type Exercise } from '../../../models/AsyncSelectorOption/Exercise'
import { type Record } from '../../../models/Record'
import { type TextFieldProps } from '@mui/material/TextField'

type Props<DisableClearable extends boolean | undefined> = {
  exercise: DisableClearable extends true ? Exercise : Exercise | null
  mutateRecordFields: UpdateFields<Record>
  disableAddNew?: boolean
  variant?: TextFieldProps['variant']
} & Pick<Record, 'activeModifiers' | 'category'> &
  Partial<AsyncSelectorProps<Exercise, DisableClearable>>
export default memo(function RecordExerciseSelector<
  DisableClearable extends boolean | undefined,
>({
  mutateRecordFields,
  activeModifiers,
  category,
  exercise,
  disableAddNew,
  variant,
  ...asyncSelectorProps
}: Props<DisableClearable>) {
  const { exercises, mutate: mutateExercises } = useExercises()

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
    <ExerciseSelector<DisableClearable>
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
}, isEqual)
