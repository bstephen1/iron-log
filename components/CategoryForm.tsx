import { Stack } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { useMemo } from 'react'
import * as yup from 'yup'
import { useExercises } from '../lib/frontend/restService'
import Category from '../models/Category'
import InputField from './form-fields/InputField'

interface Props {
  category: Category
  handleUpdate: <T extends keyof Category>(field: T, value: Category[T]) => void
}
export default function CategoryForm({ category, handleUpdate }: Props) {
  const { exercises } = useExercises({})

  const exerciseNames = useMemo(
    () => exercises?.map((exercise) => exercise.name) || [],
    [exercises]
  )

  const assignExercises = (value: string[]) => {}

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
            initialValue={category.name}
            required
            onSubmit={(value) => handleUpdate('name', value)}
            yupValidator={yup.reach(validationSchema, 'name')}
          />
        </Stack>
      </Grid>
      <Grid xs={12} sm={6}>
        {/* <ComboBoxField
          label="Exercises"
          initialValue={exercise}
          options={exerciseNames}
          fullWidth
          onSubmit={(value: string[]) => handleUpdate('categories', value)}
        /> */}
      </Grid>
    </Grid>
  )
}
