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
  const { register, error, isEmpty } = useField({
    yupValidator: validator,
    onSubmit: onSubmit,
    defaultValue: defaultValue,
  })

  return (
    <TextField
      label={label}
      inputProps={{ ...register() }}
      error={!!error}
      helperText={error ?? defaultHelperText}
      InputLabelProps={{ shrink: !isEmpty }}
      {...textFieldProps}
    />
  )
}
