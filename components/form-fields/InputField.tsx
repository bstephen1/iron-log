import CheckIcon from '@mui/icons-material/Check'
import ReplayIcon from '@mui/icons-material/Replay'
import { useRef } from 'react'
import { type Schema } from 'zod'
import TransitionIconButton from '../TransitionIconButton'
import useField from './useField'
import { type InputProps } from '@mui/material/Input'
import TextField, { type TextFieldProps } from '@mui/material/TextField'

interface Props {
  label: string
  initialValue?: string
  defaultHelperText?: string
  handleSubmit: (value: string) => void
  schema?: Schema
  /** Overrides internal behavior of when to show submit button.
   *  Has no effect if undefined.
   */
  showSubmit?: boolean
}
export default function InputField(props: Props & TextFieldProps) {
  const {
    label,
    initialValue = '',
    defaultHelperText = ' ',
    handleSubmit,
    schema,
    showSubmit,
    ...textFieldProps
  } = props

  const inputRef = useRef<HTMLInputElement>(undefined)
  const { control, reset, submit, isDirty, error } = useField({
    schema,
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
      slotProps={{
        ...textFieldProps.slotProps,
        input: {
          ...textFieldProps.slotProps?.input,
          endAdornment: (
            <>
              <TransitionIconButton
                isVisible={isDirty}
                onClick={onReset}
                tooltip="Reset"
              >
                <ReplayIcon />
              </TransitionIconButton>
              <TransitionIconButton
                isVisible={showSubmit ?? isDirty}
                disabled={!!error}
                onClick={() => submit()}
                tooltip="Submit"
              >
                <CheckIcon />
              </TransitionIconButton>
              {/* mui does not provide proper typing to fields on slotProps */}
              {
                (
                  (textFieldProps.slotProps?.input as InputProps | undefined) ??
                  {}
                ).endAdornment
              }
            </>
          ),
        },
      }}
    />
  )
}
