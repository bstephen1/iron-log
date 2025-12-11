import type { TextFieldProps } from '@mui/material/TextField'
import type { ComponentProps } from 'react'
import ExerciseSelector from '../../../components/form-fields/selectors/ExerciseSelector'
import type { PartialUpdate } from '../../../lib/types'
import type { Exercise } from '../../../models/AsyncSelectorOption/Exercise'
import type { Record } from '../../../models/Record'

type Props<DisableClearable extends boolean | undefined> = {
  mutateRecordFields: PartialUpdate<Record>
  variant?: TextFieldProps['variant']
  activeModifiers: string[]
} & Omit<
  ComponentProps<typeof ExerciseSelector<DisableClearable>>,
  'handleChange'
>

export default function RecordExerciseSelector<
  DisableClearable extends boolean | undefined,
>({
  mutateRecordFields,
  activeModifiers,
  variant,
  ...exerciseSelectorProps
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
      {...{
        handleChange,
      }}
      {...exerciseSelectorProps}
    />
  )
}
