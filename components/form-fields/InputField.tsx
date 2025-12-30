import CheckIcon from '@mui/icons-material/Check'
import ReplayIcon from '@mui/icons-material/Replay'
import Collapse from '@mui/material/Collapse'
import type { InputProps } from '@mui/material/Input'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { useRef } from 'react'
import TransitionIconButton from '../TransitionIconButton'
import useField, { type UseFieldProps } from './useField'

interface Props
  extends Pick<UseFieldProps, 'required' | 'handleSubmit' | 'handleValidate'> {
  label: string
  initialValue?: string
  /** Overrides internal behavior of when to show submit button.
   *  Has no effect if undefined.
   */
  showSubmit?: boolean
  useErrorTransition?: boolean
}
export default function InputField(props: Props & TextFieldProps) {
  const {
    label,
    initialValue = '',
    handleSubmit,
    required,
    handleValidate,
    showSubmit,
    useErrorTransition,
    ...textFieldProps
  } = props

  const inputRef = useRef<HTMLInputElement>(undefined)
  const { control, reset, submit, isDirty, error } = useField({
    required,
    handleValidate,
    handleSubmit,
    initialValue,
    autoSubmit: false,
  })

  const onReset = () => {
    reset(initialValue)
    inputRef.current?.focus()
  }

  const displayedError = useErrorTransition ? (
    <Collapse in={!!error}>
      <span>{error}</span>
    </Collapse>
  ) : (
    error
  )

  return (
    <TextField
      {...textFieldProps}
      {...control(label)}
      autoComplete="off"
      error={!!error}
      helperText={displayedError || textFieldProps.helperText}
      onKeyDown={(e) => {
        if (e.code === 'Enter') {
          submit()
          inputRef.current?.blur()
        }
      }}
      inputRef={inputRef}
      slotProps={{
        ...textFieldProps.slotProps,
        formHelperText: {
          // default <p> cannot contain any children
          component: 'div',
        },
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
                (textFieldProps.slotProps?.input as InputProps | undefined)
                  ?.endAdornment
              }
            </>
          ),
        },
      }}
    />
  )
}
