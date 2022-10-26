import { TextField, TextFieldProps } from '@mui/material'
import { useField } from 'formik'

interface Props {
  label: string // purely visual label
  name: string // the internal formik id of this field
  defaultHelperText?: string
}

export default function FormikTextField(props: Props & TextFieldProps) {
  const { label, defaultHelperText = ' ', name, ...textFieldProps } = props
  const [field, meta] = useField(name)

  return (
    <TextField
      id={field.name}
      value={field.value}
      label={label}
      error={!!meta.error}
      autoComplete="off"
      helperText={meta.error ?? defaultHelperText}
      inputProps={{ ...field }}
      {...textFieldProps}
    />
  )
}
