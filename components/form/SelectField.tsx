import { MenuItem, TextField, TextFieldProps } from '@mui/material'
import { useField } from 'formik'
import { UseFormRegister } from 'react-hook-form'

// todo: make label optional, default to capitalized name
interface Props {
  label: string // purely visual label
  name: string // the internal formik id of this field
  register: UseFormRegister<any>
  options: string[]
  error?: string
  defaultHelperText?: string
}
export default function SelectField(props: Props & TextFieldProps) {
  const {
    label,
    defaultHelperText = ' ',
    name,
    options,
    error,
    register,
    ...textFieldProps
  } = props

  return (
    <TextField
      select
      defaultValue="" // have to explicitly define the default -- undefined === error // also, this doesn't work in parent useForm()
      label={label}
      error={!!error}
      helperText={error ?? defaultHelperText}
      inputProps={{ ...register }}
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
