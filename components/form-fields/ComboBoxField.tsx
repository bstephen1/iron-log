import { CheckBoxOutlineBlank } from '@mui/icons-material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import {
  Autocomplete,
  AutocompleteProps,
  Checkbox,
  TextField,
  TextFieldProps,
} from '@mui/material'
import useField from './useField'
import withAsync from './withAsync'

export const ComboBoxField = withAsync(ComboBoxFieldBase)

interface ComboBoxFieldProps
  extends Partial<AutocompleteProps<string, true, false, false>> {
  options: string[]
  initialValue: string[]
  handleSubmit: (value: string[]) => void
  onClose?: () => void
  textFieldProps?: Partial<TextFieldProps>
}
// todo: doesn't send to db if clicking X on chips
function ComboBoxFieldBase({
  options,
  initialValue,
  handleSubmit,
  onClose,
  textFieldProps,
  ...autocompleteProps
}: ComboBoxFieldProps) {
  const { control, value, setValue } = useField<string[]>({
    handleSubmit,
    initialValue,
  })

  const handleClose = () => {
    handleSubmit(value)
    onClose?.()
  }

  // This needs to be controlled due to complex behavior between the inner input and Chips.
  // May have to modify it if debounceSubmit is desired, but that may not be necessary for this.
  // Seems like the debounce has to be a lot longer. onClose + onBlur may be enough.
  return (
    <Autocomplete
      {...control()}
      // useless renderInput to satisfy ts. Overwritten by autocompleteProps
      renderInput={(params) => <TextField {...params} />}
      onChange={(_, value) => setValue(value)}
      fullWidth
      // size="small"  // todo: use small sizes?
      multiple
      onClose={handleClose}
      disabled={initialValue == null}
      options={options ?? []}
      disableCloseOnSelect
      autoHighlight
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
      {...autocompleteProps}
    />
  )
}
