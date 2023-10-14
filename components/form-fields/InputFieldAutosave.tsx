import { TextField, TextFieldProps } from '@mui/material'
import * as yup from 'yup'
import useField from './useField'

// have to use type union instead of interface extension because TextFieldProps is an intersection type
export type InputFieldAutosaveProps = {
  label?: string
  initialValue?: string
  defaultHelperText?: string
  handleSubmit: (value: string) => void
  yupValidator?: ReturnType<typeof yup.reach>
  readOnly?: boolean
} & Partial<TextFieldProps>
export default function InputFieldAutosave(props: InputFieldAutosaveProps) {
  const {
    label,
    defaultHelperText = ' ',
    initialValue = '',
    handleSubmit,
    yupValidator,
    readOnly,
    ...textFieldProps
  } = props

  const { control, error, isEmpty } = useField<string>({
    initialValue,
    yupValidator,
    handleSubmit,
  })

  return (
    <TextField
      {...control(label)}
      autoComplete="off"
      error={!!error}
      fullWidth
      helperText={error || defaultHelperText}
      {...textFieldProps}
      InputLabelProps={{ shrink: !isEmpty, ...textFieldProps.InputLabelProps }}
      InputProps={{ readOnly, ...textFieldProps.InputProps }}
    />
  )
}
