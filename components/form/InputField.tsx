import { TextField, TextFieldProps } from '@mui/material'
import { useEffect } from 'react'
import { useForm, UseFormRegister } from 'react-hook-form'

interface Props {
  label: string // purely visual label
  name: string // the internal formik id of this field
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
  const { formState } = useForm({ mode: 'onTouched' })

  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <TextField
      label={label}
      defaultValue="hellllo"
      error={!!error}
      // autoComplete="off"
      helperText={error ?? defaultHelperText}
      inputProps={{
        ...register(name, {
          required: {
            value: !!textFieldProps.required,
            message: 'cannot be blank',
          },
          maxLength: { value: 5, message: 'too long' },
        }),
      }}
      {...textFieldProps}
    />
  )
}
