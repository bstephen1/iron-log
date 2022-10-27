import { TextField, TextFieldProps } from '@mui/material'
import { useEffect } from 'react'
import { useForm, UseFormRegister } from 'react-hook-form'

interface Props {
  label: string
  name: string
  register: UseFormRegister<any>
  error?: string
  defaultHelperText?: string
}

export default function InputField(props: Props & TextFieldProps) {
  const {
    label,
    register,
    defaultHelperText = ' ',
    error,
    name,
    ...textFieldProps
  } = props

  return (
    <TextField
      label={label}
      error={!!error}
      defaultValue=""
      helperText={error ?? defaultHelperText}
      inputProps={{ ...register(name) }}
      {...textFieldProps}
    />
  )
}
