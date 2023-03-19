import CheckIcon from '@mui/icons-material/Check'
import ReplayIcon from '@mui/icons-material/Replay'
import { TextField, TextFieldProps, Tooltip } from '@mui/material'
import { useRef } from 'react'
import { reach } from 'yup'
import TransitionIconButton from '../TransitionIconButton'
import useField from './useField'

interface Props {
  label: string
  initialValue?: string
  defaultHelperText?: string
  handleSubmit: (value: string) => void
  yupValidator: ReturnType<typeof reach>
}
export default function InputField(props: Props & TextFieldProps) {
  const {
    label,
    initialValue = '',
    defaultHelperText = ' ',
    handleSubmit,
    yupValidator,
    ...textFieldProps
  } = props

  const inputRef = useRef<HTMLInputElement>()
  const { control, reset, submit, isDirty, error } = useField<string>({
    yupValidator,
    handleSubmit,
    initialValue,
    autoSubmit: false,
  })

  const onReset = () => {
    reset(initialValue)
    inputRef.current?.focus()
  }

  return (
    <TextField
      {...textFieldProps}
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
        ...textFieldProps.InputProps,
        endAdornment: (
          <>
            <TransitionIconButton
              isVisible={isDirty}
              disabled={!!error}
              onClick={submit}
              data-testid="submit button"
            >
              <Tooltip title="submit">
                <CheckIcon />
              </Tooltip>
            </TransitionIconButton>
            <TransitionIconButton isVisible={isDirty} onClick={onReset}>
              <Tooltip title="reset">
                <ReplayIcon />
              </Tooltip>
            </TransitionIconButton>
            {textFieldProps.InputProps?.endAdornment}
          </>
        ),
      }}
    />
  )
}
