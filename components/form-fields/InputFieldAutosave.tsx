import { Input, InputProps, TextField, TextFieldProps } from '@mui/material'
import { useIMask } from 'react-imask'
import * as yup from 'yup'
import { doNothing } from '../../lib/util'
import useField from './useField'
import { ChangeEvent } from 'react'

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
  disableAutoSelect?: boolean
  /** Enable an input mask. When using a mask, initialValue and
   *  the updated value passed to handleSubmit must be in the mask format.
   */
  // imask does not export its FactoryOpts type...
  maskOptions?: Parameters<typeof useIMask>[0]
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
    disableAutoSelect,
    maskOptions,
    ...textFieldProps
  } = props

  const { error, isEmpty, ...field } = useField<string>({
    initialValue,
    yupValidator,
    handleSubmit,
    debounceMilliseconds,
  })

  // When using a mask, we have to use onAccept instead of onChange,
  // so we must extract onChange from control.
  const { onChange, ...control } = field.control(label)
  const handleChange = maskOptions ? doNothing : onChange

  const { ref } = useIMask(maskOptions ?? {}, {
    defaultValue: initialValue,
    onAccept: (value) => {
      onChange({ target: { value } } as ChangeEvent<HTMLInputElement>)
    },
  })

  const sharedProps: InputProps = {
    autoComplete: 'off',
    error: !!error,
    fullWidth: true,
    inputRef: maskOptions ? ref : undefined,
  }

  return renderAsInput ? (
    <Input
      id={id}
      {...control}
      onChange={handleChange}
      readOnly={readOnly}
      onFocus={disableAutoSelect ? doNothing : (e) => e.target.select()}
      inputProps={textFieldProps.inputProps}
      {...sharedProps}
      {...textFieldProps.InputProps}
    />
  ) : (
    <TextField
      id={id}
      {...control}
      onChange={handleChange}
      // autoselect on focus highlights input for easy overwriting
      onFocus={disableAutoSelect ? doNothing : (e) => e.target.select()}
      helperText={error || defaultHelperText}
      InputLabelProps={{ shrink: !isEmpty, ...textFieldProps.InputLabelProps }}
      {...textFieldProps}
      InputProps={{
        readOnly,
        ...sharedProps,
        ...textFieldProps.InputProps,
      }}
    />
  )
}
