// @ts-nocheck
import { TextField } from '@mui/material'
import { useField } from 'formik'

export default function FormikTextField({ label, ...props }) {
  const [field, meta, helpers] = useField(props)

  return (
    <TextField
      label={label}
      value={meta.value}
      error={!!meta.error}
      helperText={meta.error ?? ' '}
      // if doing onChange have to use the helper; or can pass field.onChange directly to inputProps
      // onChange={e => helpers.setValue(e.target.value)}
      inputProps={{ ...field, ...props }}
    />
  )
}
