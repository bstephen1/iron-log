import { CheckBoxOutlineBlank } from '@mui/icons-material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import useField from './useField'

// If the array is empty, React will create a new array every render
// thus triggering useEffect in the hook to reset to the new initialValue infinitely.
// Using a const outside the component persists the array between renders.
const EMPTY: string[] = []

interface Props {
  label: string
  options: string[]
  initialValue?: string[]
  onSubmit: (value: string[]) => void
}

// fixme: infinite rerenders if exercise is null
export default function AsyncComboBoxField(props: Props) {
  const { label, options, initialValue, onSubmit, ...textFieldProps } = props
  const [open, setOpen] = useState(false)
  const loading = open && !options

  const handleClose = () => {
    setOpen(false)
    onSubmit(value)
  }

  const { control, value, setValue } = useField<string[]>({
    onSubmit,
    initialValue: initialValue || EMPTY,
    onChange: (_: any, value: string[]) => setValue(value),
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
      disabled={initialValue == null}
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
