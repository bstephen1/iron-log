import { Autocomplete, createFilterOptions, TextField } from '@mui/material'
import { useMemo, useState } from 'react'
import { KeyedMutator } from 'swr'
import { GenericAutocompleteProps } from '../../../lib/util'
import { SelectorBaseOption } from '../../../models/SelectorBaseOption'
import { Status, StatusOrder } from '../../../models/Status'

export interface SelectorBaseProps<C>
  // Partial because this component defines all required Autocomplete props.
  // Any explicitly given AutocompleteProps will override the defaults
  extends Partial<GenericAutocompleteProps<C>> {
  label?: string
  filterCustom?: (value: C, inputValue?: string) => boolean
  /** This function can be used to reset the input value to null
   * based on the current options in the dropdown */
  handleFilterChange?: (options: C[]) => void
  /** standard autocomplete onChange() callback */
  handleChange: (value: C | null) => void
  /** locally mutate options when adding a new item.  */
  mutateOptions: KeyedMutator<C[]>
  /** constructor for C  */
  Constructor: new (name: string, status: Status) => C
  /**  function to add new C to db */
  addNewItem: (value: C) => Promise<any>
  /**  withAsync() uses this. It's too cumbersome trying to extend withAsync's props on top of extending SelectorBase so it's included here.  */
  adornmentOpen?: boolean
  startAdornment?: JSX.Element // only used in withAsync. Here to make TS happy.
}
// this component is intended to be ingested as the base layer of a HOC.
export default function SelectorBase<C extends SelectorBaseOption>({
  label,
  filterCustom,
  handleFilterChange,
  handleChange,
  options,
  mutateOptions,
  Constructor,
  addNewItem,
  startAdornment,
  ...autocompleteProps
}: SelectorBaseProps<C>) {
  // This allows the autocomplete to filter options as the user types, in real time.
  // It needs to be the result of this function call, and we can't call it
  // outside the component while keeping the generic. So, useMemo to cache the result
  const filter = useMemo(() => createFilterOptions<C>(), [])
  // This is used to track the input value to allow a new C to be created based on the current input.
  // Originally it was a separate stub class with just the name but now it is a full object of the
  // given generic type so that it can preserve the _id field across name mutations.
  const [newOption, setNewOption] = useState(new Constructor('', Status.new))

  return (
    <Autocomplete<C>
      renderInput={(params) => <TextField {...params} label={label} />}
      openOnFocus
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      autoHighlight
      options={
        // have to spread options since it is readonly and sort() mutates the array
        !!options
          ? [...options].sort(
              (a, b) => StatusOrder[a.status] - StatusOrder[b.status]
            )
          : []
      }
      isOptionEqualToValue={(option, value) => option._id === value._id}
      getOptionLabel={(option) => option.name}
      groupBy={(option) => option.status}
      onChange={async (_, option) => {
        // add the new item if selected
        if (option && option.status === Status.new) {
          newOption.status = Status.active
          await addNewItem(newOption)
          mutateOptions(options?.concat(newOption) || [newOption])
          handleChange(newOption)
          setNewOption(new Constructor('', Status.new))
        } else {
          handleChange(option)
        }
      }}
      // todo: extract Add New to yet another HOC? Can add to ComboBoxField
      filterOptions={(options, params) => {
        const { inputValue } = params
        let filtered = filter(options, params)

        if (filterCustom) {
          filtered = filtered.filter((value) => filterCustom(value, inputValue))
        }

        // append the "add new" option if input is not an existing option
        const isExisting = options.some(
          (option) => inputValue.toLowerCase() === option.name.toLowerCase()
        )
        if (inputValue && !isExisting) {
          newOption.name = inputValue
          filtered.push(newOption)
        }

        handleFilterChange?.(filtered)

        return filtered
      }}
      {...autocompleteProps}
    />
  )
}
