import { MenuItem, TextField, TextFieldProps } from '@mui/material'
import { useField } from 'formik'

// todo: make label optional, default to capitalized name
interface Props {
  label: string // purely visual label
  name: string // the internal formik id of this field
  options: string[]
  defaultHelperText?: string
}

export default function FormikSelectField(props: Props & TextFieldProps) {
  const {
    label,
    defaultHelperText = ' ',
    name,
    options,
    ...textFieldProps
  } = props
  const [field, meta] = useField(name)

  return (
    <TextField
      select
      id={field.name}
      value={field.value}
      label={label}
      error={!!meta.error}
      helperText={meta.error ?? defaultHelperText}
      inputProps={{ ...field }}
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
