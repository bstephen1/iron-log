import { createFilterOptions } from '@mui/material'
import { useState } from 'react'
import { KeyedMutator } from 'swr'
import AsyncAutocomplete, {
  AsyncAutocompleteProps,
} from '../../../components/AsyncAutocomplete'
import { AsyncSelectorOption } from '../../../models/AsyncSelectorOption'
import { Status } from '../../../models/Status'

/** The Option type is a wrapper for the generic C which adds inputValue.
 *  inputValue is populated for the new option to store the actual name value
 *  instead of the visible `Add "xxx"` string.
 */
type Option<C> = C & { inputValue?: string }

export interface AsyncSelectorProps<C extends AsyncSelectorOption>
  extends AsyncAutocompleteProps<Option<C>, false> {
  filterCustom?: (value: C, inputValue?: string) => boolean
  /** This function can be used to reset the input value to null
   * based on the current options in the dropdown */
  handleFilterChange?: (options: C[]) => void
  /** standard autocomplete onChange() callback */
  handleChange: (value: C | null) => void
  /** locally mutate options when adding a new item.
   *  If omitted, adding new items is disabled.
   */
  mutateOptions?: KeyedMutator<C[]>
  /** constructor for C  */
  Constructor: new (name: string) => C
  /**  function to add new C to db */
  addNewItem: (value: C) => Promise<any>
  /** This component does not support multiple selections. */
  multiple?: false
}
export default function AsyncSelector<C extends AsyncSelectorOption>({
  filterCustom,
  handleFilterChange,
  handleChange,
  options = [],
  mutateOptions,
  Constructor,
  addNewItem,
  ...asyncAutocompleteProps
}: AsyncSelectorProps<C>) {
  const addNewDisabled = !mutateOptions
  // This allows the autocomplete to filter options as the user types, in real time.
  // It needs to be the result of this function call, and we can't call it
  // outside the component while keeping the generic.
  const filter = createFilterOptions<Option<C>>()
  const [inputValue, setInputValue] = useState(
    asyncAutocompleteProps.value?.name ?? '',
  )

  return (
    <AsyncAutocomplete
      // Autocomplete has a bug where the input inits as null even if it has a preset value.
      // By making inputValue controlled we can provide an initial value to avoid this. See:
      // https://github.com/mui/material-ui/issues/19423#issuecomment-639659875
      // https://stackoverflow.com/a/65679069
      // https://github.com/mui/material-ui/issues/20939
      inputValue={inputValue}
      onInputChange={(_, value) => {
        setInputValue(value)
      }}
      openOnFocus
      fullWidth
      selectOnFocus
      // onBlur we reset to the value that is selected
      clearOnBlur
      handleHomeEndKeys
      autoHighlight
      options={options}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      getOptionLabel={(option) => option.name}
      onChange={async (_, newValue) => {
        // if the value is a new record, add it to the db
        if (newValue?.inputValue) {
          // The new option's name is the visible label `Add "xxx"`.
          // We want to set the name to be the raw inputValue.
          const newOption = new Constructor(newValue.inputValue)
          setInputValue(inputValue)

          // mutateOptions will always be defined here since otherwise inputValue will not be set in filterOptions
          mutateOptions?.(
            async (options = []) => {
              const newItem = await addNewItem(newOption)
              return options.concat(newItem)
            },
            { optimisticData: options.concat(newOption) },
          )

          handleChange(newOption)
        } else {
          handleChange(newValue)
        }
      }}
      filterOptions={(options, params) => {
        const { inputValue } = params
        let filtered = filter(options, params)

        if (filterCustom) {
          filtered = filtered.filter((option) =>
            filterCustom(option, inputValue),
          )
          handleFilterChange?.(filtered)
        }

        if (addNewDisabled) return filtered

        // append the "add new" option if input is not an existing option
        const isExisting = options.some(
          (option) => inputValue.toLowerCase() === option.name.toLowerCase(),
        )
        if (inputValue && !isExisting) {
          // We create a new object every time the input changes.
          // We could possibly use a ref instead, but that can result in duplicate _ids.
          const newOption = {
            ...new Constructor(`Add "${inputValue}"`),
            inputValue,
          }

          // Insert the newOption as the last active status item.
          // This puts "add new" above any archived items.
          const lastActive = filtered.findLastIndex(
            (item) => item.status === Status.active,
          )
          filtered = [
            ...filtered.slice(0, lastActive + 1),
            newOption,
            ...filtered.slice(lastActive + 1),
          ]
        }

        return filtered
      }}
      {...asyncAutocompleteProps}
    />
  )
}
