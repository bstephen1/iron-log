import { Input, InputProps, TextField, TextFieldProps } from '@mui/material'
import * as yup from 'yup'
import useField from './useField'

// have to use type union instead of interface extension because TextFieldProps is an intersection type
export type InputFieldAutosaveProps = {
  label?: string
  initialValue?: string
  defaultHelperText?: string
  handleSubmit: (value: string) => void
  yupValidator?: ReturnType<typeof yup.reach>
  readOnly?: boolean
  /** Render an Input instead of a TextField. This will allow label / helper text to
   *  be customized outside the component.
   *
   *  Note: when this option is enabled, any native textFieldProps are ignored.
   *  Extra props should instead be declared inside InputProps.
   *
   *  Note: sx appears to not work. Use style instead.
   */
  renderAsInput?: boolean
  id?: TextFieldProps['id']
  debounceMilliseconds?: number
} & Partial<TextFieldProps>
export default function InputFieldAutosave(props: InputFieldAutosaveProps) {
  const {
    label,
    defaultHelperText = ' ',
    initialValue = '',
    handleSubmit,
    yupValidator,
    readOnly,
    renderAsInput,
    id,
    debounceMilliseconds,
    ...textFieldProps
  } = props

  const { control, error, isEmpty } = useField<string>({
    initialValue,
    yupValidator,
    handleSubmit,
    debounceMilliseconds,
  })

  const sharedProps: InputProps = {
    autoComplete: 'off',
    error: !!error,
    fullWidth: true,
  }

  return renderAsInput ? (
    <Input
      id={id}
      {...control(label)}
      readOnly={readOnly}
      {...sharedProps}
      {...textFieldProps.InputProps}
    />
  ) : (
    <TextField
      id={id}
      {...control(label)}
      helperText={error || defaultHelperText}
      InputLabelProps={{ shrink: !isEmpty, ...textFieldProps.InputLabelProps }}
      InputProps={{ readOnly, ...textFieldProps.InputProps }}
      {...textFieldProps}
    />
  )
}
