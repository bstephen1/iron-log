import { Stack } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { useMemo } from 'react'
import * as yup from 'yup'
import {
  useCategories,
  useExercises,
  useModifiers,
} from '../lib/frontend/restService'
import Exercise from '../models/Exercise'
import { ExerciseStatus } from '../models/ExerciseStatus'
import { ComboBoxField } from './form-fields/ComboBoxField'
import InputField from './form-fields/InputField'
import InputFieldAutosave from './form-fields/InputFieldAutosave'
import InputListField from './form-fields/InputListField'
import SelectFieldAutosave from './form-fields/SelectFieldAutosave'

interface Props {
  exercise: Exercise
  handleUpdate: (updates: Partial<Exercise>) => void
}
export default function ExerciseForm({ exercise, handleUpdate }: Props) {
  const { modifiers } = useModifiers()
  const { categories } = useCategories()
  const { exercises } = useExercises({})

  // todo: I smell an extractable function...
  // memoize the maps so they don't have to rerun every render
  const modifierNames = useMemo(
    () => modifiers?.map((modifier) => modifier.name) || [],
    [modifiers]
  )

  const exerciseNames = useMemo(
    () => exercises?.map((exercise) => exercise.name) || [],
    [exercises]
  )

  const categoryNames = useMemo(
    () => categories?.map((category) => category.name) || [],
    [categories]
  )

  // todo: validate (drop empty notes)

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
            handleSubmit={(value) => handleUpdate({ name: value })}
            yupValidator={yup.reach(validationSchema, 'name')}
          />
          <SelectFieldAutosave
            label="Status"
            options={Object.values(ExerciseStatus)}
            initialValue={exercise.status}
            required
            yupValidator={yup.reach(validationSchema, 'status')}
            handleSubmit={(value) => handleUpdate({ status: value })}
          />
          <ComboBoxField
            label="Modifiers"
            initialValue={exercise.modifiers}
            options={modifierNames}
            handleSubmit={(value: string[]) =>
              handleUpdate({ modifiers: value })
            }
          />
        </Stack>
      </Grid>
      <Grid xs={12}>
        <InputListField
          label="Notes"
          addItemPlaceholder="Add Note"
          listItemPlaceholder="Empty Note (will be deleted)"
          values={exercise.notes}
          handleSubmit={(values: string[]) => handleUpdate({ notes: values })}
        />
      </Grid>
    </Grid>
  )
}
