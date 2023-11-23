import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { Checkbox, TextFieldProps } from '@mui/material'
import AsyncAutocomplete, {
  AsyncAutocompleteProps,
} from '../../components/AsyncAutocomplete'
import { doNothing } from '../../lib/util'
import useField from './useField'

interface ComboBoxFieldProps extends AsyncAutocompleteProps<string, true> {
  options?: string[]
  initialValue: string[]
  /** Placeholder that will only show if there are no values selected.
   *  If normal placeholder is provided it will overwrite this.
   */
  emptyPlaceholder?: string
  handleSubmit?: (value: string[]) => void
  textFieldProps?: Partial<TextFieldProps>
  /** Helper text defaults to a single whitespace to provide padding.
   *  To disable, set to an empty string.
   */
  helperText?: string
}
// todo: closes when any value changes (since that triggers onSubmit and rerenders it)
export function ComboBoxField({
  options,
  initialValue,
  emptyPlaceholder = '',
  handleSubmit = doNothing,
  textFieldProps,
  helperText = ' ',
  ...asyncAutocompleteProps
}: ComboBoxFieldProps) {
  const { control, value, setValue, isDirty } = useField<string[]>({
    handleSubmit,
    initialValue,
  })

  const handleClose = () => {
    isDirty && handleSubmit(value)
  }

  const handleChange = (value: string[] | string | null) => {
    const newValue = typeof value === 'string' ? value.split(',') : value

    setValue(newValue ?? [])
    handleSubmit(newValue ?? [])
  }

  // This needs to be controlled due to complex behavior between the inner input and Chips.
  // May have to modify it if debounceSubmit is desired, but that may not be necessary for this.
  // Originally this was only submitting onClose or onBlur, but changed to onChange because then it
  // wasn't updating if you clicked delete on the chips. But that means now it might send extra requests
  // if multiple values are being changed.
  return (
    <AsyncAutocomplete
      {...control()}
      placeholder={value.length ? '' : emptyPlaceholder}
      onChange={(_, value) => handleChange(value)}
      fullWidth
      multiple
      // todo: change color?
      // ChipProps={{ color: 'primary', variant: 'outlined' }}
      onClose={handleClose}
      options={options}
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
      textFieldProps={{
        helperText,
      }}
      {...asyncAutocompleteProps}
    />
  )
}
