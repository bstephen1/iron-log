import { MenuItem, SelectProps, TextField, TextFieldProps } from '@mui/material'
import { ReactNode } from 'react'
import * as yup from 'yup'
import useField from './useField'

interface Props<V, O> {
  label: string
  initialValue: V
  options: O[]
  defaultHelperText?: string
  handleSubmit: (value: V) => void
  yupValidator?: ReturnType<typeof yup.reach>
  children?: ReactNode
}
/** Renders a TextField Select. By default renders the given options directly as MenuItems.
 *  Children must be manually provided if options is a list of objects, along with secondary generic param.
 */
export default function SelectFieldAutosave<V extends string, O = V>(
  props: Props<V, O> & TextFieldProps
) {
  const {
    label,
    defaultHelperText = ' ',
    options,
    initialValue,
    handleSubmit,
    yupValidator,
    children,
    ...textFieldProps
  } = props

  const { control } = useField<V>({
    handleSubmit,
    initialValue,
    yupValidator,
    // select should submit as soon as a new option is picked
    debounceMilliseconds: 0,
  })

  /** Using standard variant causes input background to gray after selecting something.
   *  This behavior is apparently completely undocumented and uneditable.
   *  This prevents that, keeping background transparent.
   */
  // Note: The behavior occurs when using TextField or Select with standard variant.
  // Select can use "input={<Input />}" instead of setting variant to avoid it.
  // That doesn't work here because TextField automatically passes the variant to the inner Select.
  // Instead we have to override the variant to trick the Select to thinking it's outlined,
  // which doesn't turn gray.
  const fixStandardBackground: SelectProps =
    textFieldProps.variant === 'standard' ? { variant: 'outlined' } : {}

  if (!children && typeof options[0] !== 'string') {
    console.error(
      'SelectFieldAutosave was not rendered because it was given non-string options but no children. This component only auto-renders menus for options of type string[]. '
    )
    return <></>
  }

  return (
    <TextField
      {...control(label)}
      select
      disabled={initialValue == null}
      helperText={defaultHelperText}
      {...textFieldProps}
      SelectProps={{ ...fixStandardBackground, ...textFieldProps.SelectProps }}
    >
      {children ??
        options.map((option) =>
          typeof option === 'string' ? (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ) : (
            <></>
          )
        )}
    </TextField>
  )
}
