import { MenuItem, TextField, TextFieldProps } from '@mui/material'
import * as yup from 'yup'
import useField from './useField'

interface Props<T> {
  label: string
  initialValue: T
  options: T[]
  defaultHelperText?: string
  handleSubmit: (value: T) => void
  yupValidator?: ReturnType<typeof yup.reach>
}
export default function SelectFieldAutosave<T extends string>(
  props: Props<T> & TextFieldProps
) {
  const {
    label,
    defaultHelperText = ' ',
    options,
    initialValue,
    handleSubmit,
    yupValidator,
    ...textFieldProps
  } = props

  const { control } = useField<T>({
    handleSubmit,
    initialValue,
    yupValidator,
  })

  return (
    <TextField
      {...control(label)}
      select
      disabled={initialValue == null}
      helperText={defaultHelperText}
      {...textFieldProps}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  )
}
