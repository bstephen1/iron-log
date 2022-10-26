import { TextField } from '@mui/material'
import { FieldHookConfig, useField } from 'formik'
import { InputHTMLAttributes } from 'react'

interface Props {
  label: string
  defaultHelperText?: string
}
// The type is now quite robust, but it's probably not actually needed.
// The only thing being passed to fieldProps is type and name, and mui's TextField
// already sets type as text. I'll commit it with the full type for reference, but
// I'm going to try cutting it down. If only the fields being used are explicitly defined
// it should be more clear as well, rather than this nebulous "fieldProps" that can be
// almost anything.
export default function FormikTextField({
  label,
  defaultHelperText = ' ',
  ...fieldProps
}: Props & InputHTMLAttributes<HTMLInputElement> & FieldHookConfig<string>) {
  const [field, meta, helpers] = useField(fieldProps)

  console.log(fieldProps)

  return (
    <TextField
      label={label}
      value={meta.value}
      error={!!meta.error}
      helperText={meta.error ?? defaultHelperText}
      // if doing onChange have to use the helper; or can pass field.onChange directly to inputProps
      // onChange={e => helpers.setValue(e.target.value)}
      inputProps={{ ...field, ...fieldProps }}
    />
  )
}
