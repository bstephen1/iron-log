import { capitalize, MenuItem, TextField, TextFieldProps } from '@mui/material'
import { useRef } from 'react'
import { useFormContext } from 'react-hook-form'

// todo: make label optional, default to capitalized name
// todo: this for sure can be combined with InputField
interface Props {
  label: string
  defaultValue?: string
  options: string[]
  defaultHelperText?: string
  handleSubmit: (value: string) => void
  // yup validator
}
export default function SelectFieldAutosave(props: Props & TextFieldProps) {
  const {
    label,
    defaultValue = '',
    defaultHelperText = ' ',
    options,
    handleSubmit,
    ...textFieldProps
  } = props

  const inputRef = useRef()

  return (
    <TextField
      select
      defaultValue={defaultValue} // have to explicitly define the default: undefined === error // also, this doesn't work in parent useForm()
      label={label}
      onBlur={() => handleSubmit(inputRef.current?.value)}
      // onChange={() => handleSubmit(inputRef.current?.value)}
      // error={!!error}
      // helperText={error ?? defaultHelperText}
      // inputProps={{ ...register(name) }}
      inputRef={inputRef}
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
