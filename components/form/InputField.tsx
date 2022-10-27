import { capitalize, TextField, TextFieldProps } from '@mui/material'
import { useFormContext, UseFormRegister } from 'react-hook-form'

interface Props {
  label?: string
  name: string
  defaultHelperText?: string
}

export default function InputField(props: Props & TextFieldProps) {
  // this is uncontrolled (uses register instead of control)
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const {
    label = capitalize(props.name),
    defaultHelperText = ' ',
    name,
    ...textFieldProps
  } = props
  const error = errors[name]?.message as string

  return (
    <TextField
      label={label}
      error={!!error}
      defaultValue=""
      autoComplete="off"
      helperText={error ?? defaultHelperText}
      inputProps={{ ...register(name) }}
      {...textFieldProps}
    />
  )
}
