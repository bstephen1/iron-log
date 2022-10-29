import { MenuItem, TextField, TextFieldProps } from '@mui/material'
import { useEffect, useState } from 'react'
import { ExerciseStatus } from '../../models/ExerciseStatus'

// todo: make label optional, default to capitalized name
// todo: this for sure can be combined with InputField
interface Props {
  label: string
  initialValue?: ExerciseStatus
  options: string[]
  defaultHelperText?: string
  handleSubmit: (value: string) => void
  // yup validator
}
export default function SelectFieldAutosave(props: Props & TextFieldProps) {
  const {
    label,
    defaultHelperText = ' ',
    options,
    initialValue = '',
    handleSubmit,
    ...textFieldProps
  } = props
  const [value, setValue] = useState(initialValue)

  // todo: extract to a hook
  let timer: NodeJS.Timeout

  const handleChange = (value: string) => {
    clearTimeout(timer)
    setValue(value)

    timer = setTimeout(() => {
      handleSubmit(value)
    }, 500)
  }

  useEffect(() => {
    setValue(initialValue || '')
  }, [initialValue])

  // useEffect(() => {
  //   console.log(value);
  // }, [value]);

  return (
    <TextField
      select
      label={label}
      value={value}
      onBlur={() => handleSubmit(value)}
      onChange={(e) => handleChange(e.target.value)}
      // error={!!error}
      // helperText={error ?? defaultHelperText}
      // inputProps={{ ...register(name) }}
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
