import { TextField, TextFieldProps } from '@mui/material'
import { useEffect } from 'react'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import useField from './useField'

// todo: this for sure can be combined with InputField
interface Props {
  label: string
  defaultValue?: ExerciseStatus
  defaultHelperText?: string
  onSubmit: any
  validator: any
}
export default function InputFieldAutosave(props: Props & TextFieldProps) {
  const {
    label,
    defaultHelperText = ' ',
    defaultValue,
    onSubmit,
    validator,
    ...textFieldProps
  } = props
  const { control, error, isEmpty } = useField({
    yupValidator: validator,
    onSubmit: onSubmit,
    initialValue: defaultValue,
  })

  useEffect(() => {
    console.log('ERROR ' + error)
  }, [error])

  return (
    <TextField
      {...control(label)}
      error={!!error}
      helperText={error || defaultHelperText}
      InputLabelProps={{ shrink: !isEmpty }}
      {...textFieldProps}
    />
  )
}
