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
import useField from './useField'

interface Props {
  label: string
  options: string[]
  initialValue?: string[]
  onSubmit: Function
}

// fixme: infinite rerenders if exercise is null
export default function AsyncComboBoxField(props: Props & TextFieldProps) {
  const {
    label,
    options,
    initialValue = [],
    onSubmit,
    ...textFieldProps
  } = props
  const [open, setOpen] = useState(false)
  const loading = open && !options

  const handleClose = () => {
    setOpen(false)
    onSubmit(value)
  }

  const { control, value, setValue } = useField({
    onSubmit,
    initialValue,
    onChange: (_, value) => setValue(value),
  })

  // This needs to be controlled due to complex behavior between the inner input and Chips.
  // The useField() hook currently only supports uncontrolled inputs. May have to modify it
  // if debounceSubmit is desired, but that may not be necessary for this. Seems like the
  // debounce has to be a lot longer. onClose + onBlur may be enough.
  return (
    <Autocomplete
      {...control()}
      fullWidth
      multiple
      options={options ?? []}
      onOpen={() => setOpen(true)}
      onClose={handleClose}
      loading={loading}
      loadingText="Loading..."
      disableCloseOnSelect
      autoHighlight
      renderInput={(params) => (
        <TextField
          {...params}
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
