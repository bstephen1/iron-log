import { MenuItem, TextField, TextFieldProps } from '@mui/material'
import { useEffect, useState } from 'react'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import useField from './useField'

// todo: this for sure can be combined with InputField
interface Props {
  label: string
  initialValue?: ExerciseStatus
  options: string[]
  defaultHelperText?: string
  handleSubmit: (value: string) => void
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

  const { register } = useField({
    onSubmit: handleSubmit,
    defaultValue: initialValue,
  })

  return (
    <TextField
      select
      label={label}
      inputProps={{ ...register() }}
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
