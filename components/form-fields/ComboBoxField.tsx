import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import {
  Autocomplete,
  AutocompleteProps,
  Checkbox,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { doNothing } from '../../lib/util'
import useField from './useField'
import withAsync from './withAsync'

export const ComboBoxField = withAsync(ComboBoxFieldBase)

interface ComboBoxFieldProps
  extends Partial<AutocompleteProps<string, true, false, false>> {
  options?: string[]
  initialValue: string[]
  handleSubmit?: (value: string[]) => void
  textFieldProps?: Partial<TextFieldProps>
}
// todo: doesn't send to db if clicking X on chips
function ComboBoxFieldBase({
  options = [],
  initialValue,
  handleSubmit = doNothing,
  textFieldProps,
  ...autocompleteProps
}: ComboBoxFieldProps) {
  const { control, value, setValue, isDirty } = useField<string[]>({
    handleSubmit,
    initialValue,
  })

  const handleClose = () => {
    isDirty && handleSubmit(value)
  }

  const handleChange = (value: string[]) => {
    setValue(value)
    handleSubmit(value)
  }

  // This needs to be controlled due to complex behavior between the inner input and Chips.
  // May have to modify it if debounceSubmit is desired, but that may not be necessary for this.
  // Originally this was only submitting onClose or onBlur, but changed to onChange because then it
  // wasn't updating if you clicked delete on the chips. But that means now it might send extra requests
  // if multiple values are being changed.
  return (
    <Autocomplete
      {...control()}
      // useless renderInput to satisfy ts. Overwritten by autocompleteProps
      renderInput={(params) => <TextField {...params} />}
      onChange={(_, value) => handleChange(value)}
      fullWidth
      // size="small"  // todo: use small sizes?
      multiple
      // todo: change color?
      // ChipProps={{ color: 'primary', variant: 'outlined' }}
      onClose={handleClose}
      disabled={initialValue == null}
      options={options ?? []}
      disableCloseOnSelect
      autoHighlight
      renderOption={(props, modifierName, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon />}
            checkedIcon={<CheckBoxIcon />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {modifierName}
        </li>
      )}
      {...autocompleteProps}
    />
  )
}
