import { InputAdornment } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { useMemo } from 'react'
import * as yup from 'yup'
import { useExercises } from '../lib/frontend/restService'
import Modifier from '../models/Modifier'
import InputField from './form-fields/InputField'
import NumericFieldAutosave from './form-fields/NumericFieldAutosave'

interface Props {
  modifier: Modifier
  handleUpdate: (updates: Partial<Modifier>) => void
}
export default function ModifierForm({ modifier, handleUpdate }: Props) {
  const { exercises } = useExercises()

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
    <Grid container spacing={1} xs={12}>
      <Grid xs={12} sm={6}>
        <InputField
          label="Name"
          initialValue={modifier.name}
          required
          fullWidth
          handleSubmit={(name) => handleUpdate({ name })}
          yupValidator={yup.reach(validationSchema, 'name')}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <NumericFieldAutosave
          label="Equipment weight"
          initialValue={modifier.weight}
          handleSubmit={(weight) => handleUpdate({ weight })}
          variant="outlined"
          defaultHelperText=" "
          // todo: might want to make this selectable between lbs/kg
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        {/* <ComboBoxField
          label="Exercises"
          initialValue={exercise}
          options={exerciseNames}
          fullWidth
          handleSubmit={(value: string[]) => handleUpdate('categories', value)}
        /> */}
      </Grid>
    </Grid>
  )
}
