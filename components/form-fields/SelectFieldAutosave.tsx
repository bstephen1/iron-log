import { MenuItem, TextField, TextFieldProps } from '@mui/material'
import { useEffect, useState } from 'react'
import { ExerciseStatus } from '../../models/ExerciseStatus'

// todo: make label optional, default to capitalized name
// todo: this for sure can be combined with InputField
interface Props {
  label: string
  value?: ExerciseStatus
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
    handleSubmit,
    ...textFieldProps
  } = props
  const [value, setValue] = useState(props.value || '')

  // todo: extract to a hook
  let timer: NodeJS.Timeout

  const handleChange = (value: string) => {
    clearTimeout(timer)

    timer = setTimeout(() => {
      handleSubmit(value)
    }, 500)
  }

  useEffect(() => {
    console.log(props.value)
    setValue(props.value || '')
  }, [props.value])

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
