import { capitalize, MenuItem, TextField, TextFieldProps } from '@mui/material'
import { useFormContext, UseFormRegister } from 'react-hook-form'

// todo: make label optional, default to capitalized name
// todo: this for sure can be combined with InputField
interface Props {
  label?: string
  name: string
  options: string[]
  defaultHelperText?: string
}
export default function SelectField(props: Props & TextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const {
    label = capitalize(props.name),
    defaultHelperText = ' ',
    name,
    options,
    ...textFieldProps
  } = props
  const error = errors[name]?.message as string // todo: can we define the fields or something to not have to force to string?

  return (
    <TextField
      select
      defaultValue="" // have to explicitly define the default: undefined === error // also, this doesn't work in parent useForm()
      label={label}
      error={!!error}
      helperText={error ?? defaultHelperText}
      inputProps={{ ...register(name) }}
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
