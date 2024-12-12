import CheckIcon from '@mui/icons-material/Check'
import ReplayIcon from '@mui/icons-material/Replay'
import { InputProps, TextField, TextFieldProps, Tooltip } from '@mui/material'
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
    yupValidator,
    showSubmit,
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
      slotProps={{
        ...textFieldProps.slotProps,
        input: {
          ...textFieldProps.slotProps?.input,
          endAdornment: (
            <>
              <TransitionIconButton isVisible={isDirty} onClick={onReset}>
                <Tooltip title="Reset">
                  <ReplayIcon />
                </Tooltip>
              </TransitionIconButton>
              <TransitionIconButton
                isVisible={showSubmit ?? isDirty}
                disabled={!!error}
                onClick={() => submit()}
                data-testid="submit button"
              >
                <Tooltip title="Submit">
                  <CheckIcon />
                </Tooltip>
              </TransitionIconButton>
              {/* mui does not provide proper typing to fields on slotProps */}
              {(textFieldProps.slotProps?.input as InputProps)?.endAdornment}
            </>
          ),
        },
      }}
    />
  )
}
