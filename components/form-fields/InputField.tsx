import { Check, RestartAlt } from '@mui/icons-material'
import { TextField, TextFieldProps } from '@mui/material'
import { useRef } from 'react'
import { reach } from 'yup'
import TransitionIconButton from '../TransitionIconButton'
import useField from './useField'

// have to omit onSubmit because TextFieldProps has this as an undocumented property (and handleSubmit!)
interface Props extends Omit<TextFieldProps, 'onSubmit'> {
  label: string
  initialValue?: string
  defaultHelperText?: string
  onSubmit: (value: string) => void
  yupValidator: ReturnType<typeof reach>
}
export default function InputField(props: Props) {
  const {
    label,
    initialValue = '',
    defaultHelperText = ' ',
    onSubmit,
    yupValidator,
    ...textFieldProps
  } = props

  const inputRef = useRef<HTMLInputElement>()
  const { control, reset, submit, isDirty, error } = useField<string>({
    yupValidator,
    onSubmit,
    initialValue,
    autoSubmit: false,
  })

  const onReset = () => {
    reset(initialValue)
    inputRef.current?.focus()
  }

  return (
    <TextField
      {...control(label)}
      error={!!error}
      autoComplete="off"
      helperText={error || defaultHelperText}
      onKeyDown={(e) => {
        if (e.code === 'Enter') {
          submit()
          inputRef.current?.blur()
        }
      }}
      inputRef={inputRef}
      InputProps={{
        endAdornment: (
          <>
            <TransitionIconButton
              isVisible={isDirty}
              disabled={!!error}
              onClick={submit}
            >
              <Check />
            </TransitionIconButton>
            <TransitionIconButton isVisible={isDirty} onClick={onReset}>
              <RestartAlt />
            </TransitionIconButton>
          </>
        ),
      }}
      {...textFieldProps}
    />
  )
}