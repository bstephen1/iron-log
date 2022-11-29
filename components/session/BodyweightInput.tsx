import { InputAdornment } from '@mui/material'
import * as yup from 'yup'
import InputField from '../form-fields/InputField'

export default function BodyweightInput() {
  // todo: can we enumerate the Exercise fields instead of hardcoding?
  const validationSchema = yup.object({
    value: yup.number().required('Must have a value'),
  })

  return (
    <InputField
      type="number"
      label="Bodyweight"
      handleSubmit={() => {}}
      yupValidator={yup.reach(validationSchema, 'value')}
      InputProps={{
        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
      }}
      defaultHelperText="Using latest weigh-in from 2022-09-26"
    />
  )
}
