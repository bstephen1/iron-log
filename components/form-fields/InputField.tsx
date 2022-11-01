import { Check, RestartAlt } from '@mui/icons-material'
import { capitalize, TextField, TextFieldProps } from '@mui/material'
import { reach } from 'yup'
import TransitionIconButton from '../TransitionIconButton'
import useField from './useField'

interface Props {
  label: string
  initialValue?: string
  defaultHelperText?: string
  onSubmit: (value: any) => void
  yupValidator: ReturnType<typeof reach>
}

export default function InputField(props: Props & TextFieldProps) {
  const {
    label,
    initialValue = '',
    defaultHelperText = ' ',
    onSubmit,
    yupValidator,
    ...textFieldProps
  } = props

  const { control, reset, submit, isDirty, error } = useField<string>({
    yupValidator,
    onSubmit,
    initialValue,
    autoSubmit: false,
  })

  return (
    <TextField
      {...control(label)}
      error={!!error}
      autoComplete="off"
      helperText={error || defaultHelperText}
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
            <TransitionIconButton
              isVisible={isDirty}
              onClick={() => reset(initialValue)}
            >
              <RestartAlt />
            </TransitionIconButton>
          </>
        ),
      }}
      {...textFieldProps}
    />
  )
}
