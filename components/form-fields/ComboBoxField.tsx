import { CheckBoxOutlineBlank } from '@mui/icons-material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { Autocomplete, Checkbox, TextField } from '@mui/material'
import { withAsync } from '../withAsync'
import useField from './useField'

export const ComboBoxField = withAsync(ComboBoxFieldBase)

interface Props {
  label: string
  options: string[]
  initialValue: string[]
  onSubmit: (value: string[]) => void
}
// todo: doesn't send to db if clicking X on chips
// todo: such a headache extending autocompleteProps
function ComboBoxFieldBase(props: Props & any) {
  const { label, options, initialValue, onSubmit, ...autocompleteProps } = props

  const { control, value, setValue } = useField<string[]>({
    onSubmit,
    initialValue: initialValue,
  })

  const handleClose = () => {
    onSubmit(value)
    props.onClose && props.onClose()
  }

  // This needs to be controlled due to complex behavior between the inner input and Chips.
  // The useField() hook currently only supports uncontrolled inputs. May have to modify it
  // if debounceSubmit is desired, but that may not be necessary for this. Seems like the
  // debounce has to be a lot longer. onClose + onBlur may be enough.
  return (
    <Autocomplete
      {...control()}
      {...autocompleteProps}
      onChange={(_, value: string[]) => setValue(value)} // todo: shouldn't need to assert type
      fullWidth
      // size="small"  // todo: use small sizes?
      multiple
      onClose={handleClose}
      disabled={initialValue == null}
      options={options ?? []}
      disableCloseOnSelect
      autoHighlight
      renderInput={
        props.renderInput
          ? props.renderInput
          : (params) => <TextField {...params} label={props.label} />
      }
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
