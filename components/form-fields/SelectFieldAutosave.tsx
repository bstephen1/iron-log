import { MenuItem, TextField, TextFieldProps } from '@mui/material'
import { useEffect, useState } from 'react'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import useField from './useField'

// todo: this for sure can be combined with InputField
interface Props {
  label: string
  initialValue: ExerciseStatus
  options: string[]
  defaultHelperText?: string
  handleSubmit: (value: string) => void
}
export default function SelectFieldAutosave(props: Props & TextFieldProps) {
  const {
    label,
    defaultHelperText = ' ',
    options,
    initialValue,
    handleSubmit,
    ...textFieldProps
  } = props

  const { control } = useField({
    onSubmit: handleSubmit,
    initialValue: initialValue,
  })

  return (
    <TextField
      {...control(label)}
      select
      disabled={initialValue == null}
      helperText={defaultHelperText}
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
