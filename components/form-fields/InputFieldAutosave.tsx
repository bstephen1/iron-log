import { TextField, TextFieldProps } from '@mui/material'
import { useEffect, useState } from 'react'
import { ExerciseStatus } from '../../models/ExerciseStatus'

// todo: make label optional, default to capitalized name
// todo: this for sure can be combined with InputField
interface Props {
  label: string
  initialValue?: ExerciseStatus
  defaultHelperText?: string
  handleSubmit: (value: string) => void
  // yup validator
}
export default function InputFieldAutosave(props: Props & TextFieldProps) {
  const {
    label,
    defaultHelperText = ' ',
    handleSubmit,
    initialValue,
    ...textFieldProps
  } = props
  const [value, setValue] = useState(initialValue || '')

  // todo: extract to a hook
  let timer: NodeJS.Timeout

  const handleChange = (value: string) => {
    clearTimeout(timer)
    console.log(value)
    setValue(value)
    // timer = setTimeout(() => {
    //   handleSubmit(value)
    // }, 500)
  }

  console.log(textFieldProps)

  useEffect(() => {
    setValue(initialValue || '')
  }, [initialValue])

  return (
    <TextField
      label={label}
      value={value}
      onBlur={() => handleSubmit(value)}
      onChange={(e) => handleChange(e.target.value)}
      InputLabelProps={{ shrink: !!value }}
      // error={!!error}
      // helperText={error ?? defaultHelperText}
      // inputProps={{ ...register(name) }}
      {...textFieldProps}
    />
  )
}
