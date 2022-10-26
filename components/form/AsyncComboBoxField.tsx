import { CheckBoxOutlineBlank } from '@mui/icons-material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import {
  Autocomplete,
  Checkbox,
  TextField,
  CircularProgress,
  TextFieldProps,
} from '@mui/material'
import { useField } from 'formik'
import { useState } from 'react'

interface Props {
  label: string // purely visual label
  name: string // the internal formik id of this field
  options?: string[]
}

export default function AsyncComboBoxField(props: Props & TextFieldProps) {
  const { label, name, options, ...textFieldProps } = props
  const [field, _, helpers] = useField({ name: name, multiple: true })
  const [open, setOpen] = useState(false)
  const loading = open && !options

  console.log('autocomplete')
  console.log(field)

  console.table(field)
  return (
    <Autocomplete
      {...field}
      id={field.name}
      fullWidth
      multiple
      options={options ?? []}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      loading={loading}
      loadingText="Loading..."
      disableCloseOnSelect
      autoHighlight
      onChange={(_, value) => {
        helpers.setValue(value || '')
      }}
      onBlur={() => helpers.setTouched(true)}
      renderInput={(params) => (
        <TextField
          {...params}
          name={field.name}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
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
