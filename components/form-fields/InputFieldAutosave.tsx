import { TextField, TextFieldProps } from '@mui/material'
import { useEffect } from 'react'
import * as yup from 'yup'
import useField from './useField'

// todo: this for sure can be combined with InputField
interface Props {
  label: string
  initialValue?: string
  defaultHelperText?: string
  onSubmit: (value: string) => void
  yupValidator: ReturnType<typeof yup.reach>
}
export default function InputFieldAutosave(props: Props & TextFieldProps) {
  const {
    label,
    defaultHelperText = ' ',
    initialValue,
    onSubmit,
    yupValidator,
    ...textFieldProps
  } = props
  const { control, error, isEmpty } = useField({
    // @ts-ignore useField is annoyingly inferring some random HTML type instead of string which is explicitly specificed but whatever
    initialValue: initialValue || '',
    yupValidator: yupValidator,
    onSubmit: onSubmit,
  })

  useEffect(() => {
    console.log('ERROR ' + error)
  }, [error])

  return (
    <TextField
      {...control(label)}
      disabled={initialValue == null}
      autoComplete="off"
      error={!!error}
      helperText={error || defaultHelperText}
      InputLabelProps={{ shrink: !isEmpty }}
      {...textFieldProps}
    />
  )
}
