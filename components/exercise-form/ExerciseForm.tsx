import { Stack } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { useMemo } from 'react'
import * as yup from 'yup'
import { useExercises, useModifiers } from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import { ComboBoxField } from '../form-fields/ComboBoxField'
import InputField from '../form-fields/InputField'
import InputFieldAutosave from '../form-fields/InputFieldAutosave'
import InputListField from '../form-fields/InputListField'
import SelectFieldAutosave from '../form-fields/SelectFieldAutosave'

interface Props {
  exercise: Exercise
  handleUpdate: <T extends keyof Exercise>(field: T, value: Exercise[T]) => void
}
export default function ExerciseForm({ exercise, handleUpdate }: Props) {
  const { modifiers } = useModifiers()
  const { exercises } = useExercises()

  // memoize the maps so they don't have to rerun every render
  const modifierNames = useMemo(
    () => modifiers?.map((modifier) => modifier.name) || [],
    [modifiers]
  )

  const exerciseNames = useMemo(
    () => exercises?.map((exercise) => exercise.name) || [],
    [exercises]
  )

  // todo: validate (drop empty cues)

  // This method requires using anonymous functions rather than arrow functions (using "function" keyword)
  // because arrow functions preserve the context of "this", but Yup needs the nested "this" from addMethod.
  yup.addMethod(
    yup.string,
    'unique',
    function (message: string, list: string[]) {
      return this.test('unique', message, function (value) {
        return !!value && list.length !== new Set(list.concat(value)).size
      })
    }
  )

  // todo: can we enumerate the Exercise fields instead of hardcoding?
  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Must have a name')
      // todo: ts isn't recognizing that addMethod() added this. Possible solutions: https://github.com/jquense/yup/issues/312
      // @ts-ignore
      .unique('This exercise already exists!', exerciseNames),
    status: yup.string().required('Must have a status'),
  })

  return (
    <Grid container spacing={2} xs={12}>
      <Grid xs={12} sm={6}>
        <Stack>
          {/* todo: would be great to consolidate this somehow. Maybe have a "name" for the inputFields.
            Export the schema and have the hook pull it in?  */}
          <InputField
            label="Name"
            initialValue={exercise.name}
            required
            onSubmit={(value) => handleUpdate('name', value)}
            yupValidator={yup.reach(validationSchema, 'name')}
          />
          <SelectFieldAutosave
            label="Status"
            options={Object.values(ExerciseStatus)}
            initialValue={exercise.status}
            required
            yupValidator={yup.reach(validationSchema, 'status')}
            onSubmit={(value) => handleUpdate('status', value)}
          />
          <ComboBoxField
            label="Valid Modifiers"
            initialValue={exercise.validModifiers}
            options={modifierNames}
            onSubmit={(value: string[]) =>
              handleUpdate('validModifiers', value)
            }
          />
        </Stack>
      </Grid>
      <Grid xs={12} sm={6}>
        <InputFieldAutosave
          label="Notes"
          initialValue={exercise.notes}
          fullWidth
          onSubmit={(value) => handleUpdate('notes', value)}
        />
      </Grid>
      <Grid xs={12}>
        <InputListField
          label="Cues"
          addItemPlaceholder="Add Cue"
          listItemPlaceholder="Empty Cue (will be deleted)"
          values={exercise.cues}
          onSubmit={(values: string[]) => handleUpdate('cues', values)}
        />
      </Grid>
    </Grid>
  )
}
