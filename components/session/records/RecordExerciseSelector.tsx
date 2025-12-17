import type { TextFieldProps } from '@mui/material/TextField'
import { type ComponentProps, memo } from 'react'
import isEqual from 'react-fast-compare'
import ExerciseSelector from '../../../components/form-fields/selectors/ExerciseSelector'
import type { Exercise } from '../../../models/AsyncSelectorOption/Exercise'
import { useRecordUpdate } from './useRecordUpdate'

type Props<DisableClearable extends boolean | undefined> = {
  _id: string
  date: string
  activeModifiers: string[]
  exercise: Exercise | null
  variant?: TextFieldProps['variant']
} & Omit<
  ComponentProps<typeof ExerciseSelector<DisableClearable>>,
  'handleChange'
>

export default memo(function RecordExerciseSelector<
  DisableClearable extends boolean | undefined,
>({
  _id,
  date,
  variant,
  activeModifiers,
  exercise,
  ...exerciseSelectorProps
}: Props<DisableClearable>) {
  const updateRecord = useRecordUpdate(_id)
  const handleChange = async (newExercise: Exercise | null) => {
    // if an exercise changes, discard any modifiers that are not valid for the new exercise
    const remainingModifiers = activeModifiers.filter((modifier) =>
      newExercise?.modifiers.some((exercise) => exercise === modifier)
    )

    updateRecord({
      exercise: newExercise,
      activeModifiers: remainingModifiers,
    })
  }

  return (
    <ExerciseSelector<DisableClearable>
      variant={variant ?? 'standard'}
      {...{
        exercise,
        handleChange,
      }}
      {...exerciseSelectorProps}
    />
  )
}, isEqual)
