import { Input, InputProps, TextField, TextFieldProps } from '@mui/material'
import { ChangeEvent, InputHTMLAttributes } from 'react'
import { useIMask } from 'react-imask'
import * as yup from 'yup'
import { doNothing } from '../../lib/util'
import useField from './useField'

const numericInput: InputHTMLAttributes<HTMLInputElement> = {
  inputMode: 'decimal',
  type: 'number',
}

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
  /** Sets up the input to use a numeric keyboard for mobile devices.
   *  Use this prop instead of manually setting slotProps.
   */
  isNumeric?: boolean
  alwaysShrinkLabel?: boolean
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
    isNumeric,
    alwaysShrinkLabel,
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

  const sharedProps: Omit<InputProps, 'ref'> = {
    autoComplete: 'off',
    error: !!error,
    fullWidth: true,
    inputRef: maskOptions ? ref : undefined,
  }

  const htmlInput = isNumeric ? numericInput : {}

  return renderAsInput ? (
    <Input
      id={id}
      {...control}
      {...sharedProps}
      onChange={handleChange}
      readOnly={readOnly}
      onFocus={disableAutoSelect ? doNothing : (e) => e.target.select()}
      slotProps={{
        // @ts-ignore spreading htmlInput is not an error
        input: {
          ...htmlInput,
          ...textFieldProps.slotProps?.htmlInput,
        },
      }}
    />
  ) : (
    <TextField
      id={id}
      {...control}
      onChange={handleChange}
      // autoselect on focus highlights input for easy overwriting
      onFocus={disableAutoSelect ? doNothing : (e) => e.target.select()}
      helperText={error || defaultHelperText}
      {...textFieldProps}
      slotProps={{
        ...textFieldProps.slotProps,
        input: {
          readOnly,
          // slotProps is incompatible with InputProps 'ref' so that needs to be omitted from sharedProps
          ...sharedProps,
          ...textFieldProps.slotProps?.input,
        },
        // spreading textFieldProps.slotProps.inputLabel makes typescript freak out so we avoid it
        inputLabel: {
          shrink: !isEmpty || alwaysShrinkLabel,
        },
        htmlInput: { ...htmlInput, ...textFieldProps.slotProps?.htmlInput },
      }}
    />
  )
}
