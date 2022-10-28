import { capitalize, TextField, TextFieldProps } from '@mui/material'
import { useFormContext } from 'react-hook-form'

interface Props {
  label?: string
  name: string
  defaultHelperText?: string
}

export default function InputField(props: Props & TextFieldProps) {
  // this is uncontrolled (uses register instead of control)
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext()
  const {
    label = capitalize(props.name),
    defaultHelperText = ' ',
    name,
    ...textFieldProps
  } = props
  const error = errors[name]?.message as string
  const isEmpty = !watch(name)

  return (
    <TextField
      label={label}
      error={!!error}
      autoComplete="off"
      helperText={error ?? defaultHelperText}
      inputProps={{ ...register(name) }}
      // MUI has a known issue with shrink not recognizing a value change to/from empty, so we have to force set it here
      // see: https://mui.com/material-ui/react-text-field/#shrink
      InputLabelProps={{ shrink: !isEmpty }}
      {...textFieldProps}
    />
  )
}
