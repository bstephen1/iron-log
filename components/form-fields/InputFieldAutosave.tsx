import { TextField, TextFieldProps } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { ExerciseStatus } from '../../models/ExerciseStatus'

// todo: this for sure can be combined with InputField
interface Props {
  label: string
  defaultValue?: ExerciseStatus
  defaultHelperText?: string
  onSubmit: any
  validate: any
}
export default function InputFieldAutosave(props: Props & TextFieldProps) {
  const {
    label,
    defaultHelperText = ' ',
    defaultValue,
    onSubmit,
    validate,
    ...textFieldProps
  } = props

  // todo: extract to a hook
  const timerRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<any>() // mui uses any...
  const [error, setError] = useState('')

  // const schema = yup.object({
  //   notes: yup.string(),
  // })

  const resetDebouncedSave = () => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(validateAndSubmit, 800)
  }

  const validateAndSubmit = () => {
    validate
      .validate(inputRef.current.value)
      .then(() => {
        setError('')
        onSubmit(inputRef.current.value)
      })
      .catch((e) => setError(e.message))
  }

  useEffect(() => {
    inputRef.current.value = defaultValue ?? ''
  }, [defaultValue])

  return (
    <TextField
      label={label}
      defaultValue={defaultValue}
      onBlur={validateAndSubmit}
      // onBlur={() => handleSubmit(value)}
      onChange={resetDebouncedSave}
      // InputLabelProps={{ shrink: !!inputRef.current.value }}
      inputRef={inputRef}
      error={!!error}
      helperText={error ?? defaultHelperText}
      // inputProps={{ ...register(name) }}
      {...textFieldProps}
    />
  )
}
