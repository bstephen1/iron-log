import { CheckBoxOutlineBlank } from '@mui/icons-material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { useState } from 'react'
import { useController, UseFormRegister } from 'react-hook-form'

interface Props {
  label: string // purely visual label
  name: string // the internal formik id of this field
  options: string[]
  control: any
  error?: string
  register: UseFormRegister<any>
}

export default function AsyncComboBoxField(props: Props & TextFieldProps) {
  const { label, name, control, options, register, ...textFieldProps } = props
  const [open, setOpen] = useState(false)
  const {
    field: { value, onChange },
  } = useController({ name, control })
  const loading = open && !options

  return (
    <Autocomplete
      value={value}
      // need to manually handle onChange because the Chips are seperate from the base input
      onChange={(_, value) => onChange(value)}
      fullWidth
      multiple
      options={options ?? []}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      loading={loading}
      loadingText="Loading..."
      disableCloseOnSelect
      autoHighlight
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
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
