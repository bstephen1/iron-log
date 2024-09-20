import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import {
  AutocompleteChangeReason,
  Checkbox,
  TextFieldProps,
} from '@mui/material'
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
  /** Called on any change to the value array. Provides the entire new value array. */
  handleSubmit?: (newValueArray: string[]) => void
  /** Called on any change to the value array. Provides only the changed value,
   *  and the reason for the change (whether the value was added or removed). */
  handleChange?: (
    changedValue: string | undefined,
    reason: AutocompleteChangeReason,
  ) => void
  /** Behavior to follow when adding new items to the value array.
   *
   *  @append append new item to end of array (default)
   *  @filter filter through the options array to preserve order
   */
  changeBehavior?: 'append' | 'filter'
  textFieldProps?: Partial<TextFieldProps>
  /** Helper text defaults to a single whitespace to provide padding.
   *  To disable, set to an empty string.
   */
  helperText?: string
}
export default function ComboBoxField({
  options = [],
  initialValue,
  emptyPlaceholder = '',
  handleSubmit = doNothing,
  handleChange = doNothing,
  changeBehavior = 'append',
  textFieldProps,
  helperText = ' ',
  ...asyncAutocompleteProps
}: ComboBoxFieldProps) {
  const { control, value, setValue } = useField<string[]>({
    initialValue,
    autoSubmit: false,
  })

  const onChange = (
    newValue: string[] | string | null,
    reason: AutocompleteChangeReason,
  ) => {
    const formattedNewValue =
      typeof newValue === 'string' ? newValue.split(',') : (newValue ?? [])
    let change
    if (reason === 'selectOption') {
      change = formattedNewValue[formattedNewValue?.length - 1]
    } else if (reason === 'removeOption') {
      change = value.find((item) => !formattedNewValue.includes(item))
    }

    setValue(
      changeBehavior === 'filter'
        ? options.filter((option) => formattedNewValue.includes(option))
        : formattedNewValue,
    )
    handleChange(change, reason)
    handleSubmit(formattedNewValue)
  }

  // This needs to be controlled due to complex behavior between the inner input and Chips.
  // It submits updates whenever the selected value array changes.
  return (
    <AsyncAutocomplete
      {...control()}
      placeholder={value.length ? '' : emptyPlaceholder}
      onChange={(_, value, reason) => onChange(value, reason)}
      fullWidth
      multiple
      // todo: change color?
      // ChipProps={{ color: 'primary', variant: 'outlined' }}
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
