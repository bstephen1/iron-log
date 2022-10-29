import { TextField, TextFieldProps } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { ExerciseStatus } from '../../models/ExerciseStatus'

// todo: make label optional, default to capitalized name
// todo: this for sure can be combined with InputField
interface Props {
  label: string
  defaultValue?: ExerciseStatus
  defaultHelperText?: string
  onSubmit: any
  // yup validator
}
export default function InputFieldAutosave(props: Props & TextFieldProps) {
  const {
    label,
    defaultHelperText = ' ',
    defaultValue,
    onSubmit,
    ...textFieldProps
  } = props

  // todo: extract to a hook
  let timer = useRef<NodeJS.Timeout>()

  // const schema = yup.object({
  //   notes: yup.string(),
  // })

  const { register, setValue, watch } = useForm()

  const handleChange = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      onSubmit(watch('notes'))
    }, 500)
  }

  useEffect(() => {
    console.log()
    setValue('notes', defaultValue)
  }, [defaultValue])

  return (
    <TextField
      label={label}
      defaultValue={defaultValue}
      onBlur={() => onSubmit(watch('notes'))}
      // onBlur={() => handleSubmit(value)}
      onKeyDown={handleChange} // seems to work better than onChange (eg, user could be holding down bksp)
      // InputLabelProps={{ shrink: !!inputRef.current.value }}
      inputProps={{
        ...register('notes', {}),
      }}
      // error={!!error}
      // helperText={error ?? defaultHelperText}
      // inputProps={{ ...register(name) }}
      {...textFieldProps}
    />
  )
}
