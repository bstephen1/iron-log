import { TextField, TextFieldProps } from '@mui/material'
import * as yup from 'yup'
import useField from './useField'

interface Props extends Omit<TextFieldProps, 'onSubmit'> {
  label?: string
  initialValue: string
  defaultHelperText?: string
  onSubmit: (value: string) => void
  yupValidator?: ReturnType<typeof yup.reach>
}
export default function InputFieldAutosave(props: Props) {
  const {
    label,
    defaultHelperText = ' ',
    initialValue = '',
    onSubmit,
    yupValidator,
    ...textFieldProps
  } = props

  const { control, error, isEmpty } = useField<string>({
    initialValue,
    yupValidator,
    onSubmit,
  })

  return (
    <TextField
      {...control(label)}
      autoComplete="off"
      error={!!error}
      helperText={error || defaultHelperText}
      InputLabelProps={{ shrink: !isEmpty }}
      {...textFieldProps}
    />
  )
}
