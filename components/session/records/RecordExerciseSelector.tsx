import type { TextFieldProps } from '@mui/material/TextField'
import { memo } from 'react'
import isEqual from 'react-fast-compare'
import type { AsyncSelectorProps } from '../../../components/form-fields/selectors/AsyncSelector'
import ExerciseSelector from '../../../components/form-fields/selectors/ExerciseSelector'
import type { PartialUpdate } from '../../../lib/util'
import type { Exercise } from '../../../models/AsyncSelectorOption/Exercise'
import type { Record } from '../../../models/Record'

type Props<DisableClearable extends boolean | undefined> = {
  exercise: DisableClearable extends true ? Exercise : Exercise | null
  mutateRecordFields: PartialUpdate<Record>
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
      categoryFilter={category}
      handleCategoryFilterChange={(category) =>
        mutateRecordFields({ category })
      }
      {...{
        exercise,
        handleChange,
        disableAddNew,
      }}
      {...asyncSelectorProps}
    />
  )
}, isEqual)
