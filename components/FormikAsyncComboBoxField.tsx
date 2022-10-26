import { CheckBoxOutlineBlank } from '@mui/icons-material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import {
  Autocomplete,
  Checkbox,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { useField } from 'formik'
import { useState } from 'react'

interface Props {
  label: string // purely visual label
  name: string // the internal formik id of this field
  options: any
}

export default function FormikAsyncComboBoxField(
  props: Props & TextFieldProps
) {
  const { label, name, options, ...textFieldProps } = props
  const [field, meta, helpers] = useField({ name: name, multiple: true })
  const [open, setOpen] = useState(false)

  function t(s: any) {
    console.log(s)
    return s
  }

  console.table(field)
  return (
    <Autocomplete
      id={field.name}
      multiple
      fullWidth
      options={options}
      // onOpen={() => setOpen(true)}
      // onClose={() => setOpen(false)}
      // loading
      // loadingText
      disableCloseOnSelect
      autoHighlight
      {...field}
      // is there a way to get this into inputProps??
      onChange={(_, value) => {
        helpers.setValue(value || '')
      }}
      onBlur={() => helpers.setTouched(true)}
      renderInput={(params) => (
        <TextField
          {...params}
          name={field.name}
          label={label}
          inputProps={{ ...params.inputProps }}
          // InputProps={{
          //   ...params.InputProps,
          // endAdornment: (
          //   <>
          //     {loading && <CircularProgress color="inherit" size={20} />}
          //     {params.InputProps.endAdornment}
          //   </>
          // ),
          // }}
        />
      )}
      renderOption={(props, modifierName, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlank />}
            checkedIcon={<CheckBoxIcon />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {modifierName}
        </li>
      )}
    />
  )
}
