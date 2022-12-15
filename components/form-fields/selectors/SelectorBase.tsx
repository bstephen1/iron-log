import { Autocomplete, createFilterOptions, TextField } from '@mui/material'
import { useMemo } from 'react'
import { KeyedMutator } from 'swr'
import { GenericAutocompleteProps } from '../../../lib/util'
import { NamedObject, NamedStub } from '../../../models/NamedObject'

export interface SelectorBaseProps<C, S>
  // Partial because this component defines all required Autocomplete props.
  // Any explicitly given AutocompleteProps will override the defaults
  extends Partial<GenericAutocompleteProps<C | S>> {
  label?: string
  filterCustom?: (value: C, inputValue?: string) => boolean
  handleFilterChange?: (options: (C | NamedStub)[]) => void
  handleChange: (value: C | null) => void
  mutateOptions: KeyedMutator<C[]>
  StubConstructor: new (name: string) => S
  Constructor: new (name: string) => C
  // function to add new C (created from stub) to db
  addNewItem: (value: C) => void
  // have to explicitly declare options is C[] or Autocomplete will think it's (C | S)[].
  // options is the db res, so will not include the keyless Stub value
  options?: C[]
  startAdornment?: JSX.Element // only used in withAsync. Here to make TS happy.
}
// this component is intended to be ingested as the base layer of a HOC.
export default function SelectorBase<C extends NamedObject>({
  // value,
  label,
  filterCustom,
  handleFilterChange,
  handleChange,
  options, // todo: these should be part of autocompleteProps
  mutateOptions,
  StubConstructor,
  Constructor,
  addNewItem,
  startAdornment,
  ...autocompleteProps
}: SelectorBaseProps<C, NamedStub>) {
  // This allows the autocomplete to filter options as the user types, in real time.
  // It needs to be the result of this function call, and we can't call it
  // outside the component while keeping the generic. So, useMemo to cache the result
  const filter = useMemo(() => createFilterOptions<C | NamedStub>(), [])

  return (
    <Autocomplete<C | NamedStub>
      renderInput={(params) => <TextField {...params} label={label} />}
      openOnFocus
      selectOnFocus
      clearOnBlur
      disablePortal // this will ensure the dropdown cannot overlap the category filter dropdown
      handleHomeEndKeys
      autoHighlight // todo: this sometimes pops up over Category selector for Exercises
      options={options || []}
      // value={value} // todo: this is just undefined currently. Probably will hash out when typing
      isOptionEqualToValue={(a, b) => a.name === b.name}
      getOptionLabel={(option) => option.name}
      onChange={(_, option) => {
        // add the new item if selected
        if (option && !('_id' in option)) {
          const newItem = new Constructor(option.name)
          mutateOptions(options?.concat(newItem))
          addNewItem(newItem)
          handleChange(newItem)
        } else {
          handleChange(option)
        }
      }}
      // todo: extract Add New to yet another HOC? Can add to ComboBoxField
      filterOptions={(options, params) => {
        const { inputValue } = params
        let filtered = filter(options, params)

        if (filterCustom) {
          // this is called before NamedStub is appended to list so we must assert it's type C
          filtered = filtered.filter((value) =>
            filterCustom(value as C, inputValue)
          )
        }

        // append the "add new" Stub end of list
        const isExisting = options.some((option) => inputValue === option.name)
        if (inputValue && !isExisting) {
          filtered.push(new StubConstructor(inputValue))
        }

        handleFilterChange?.(filtered)
        return filtered
      }}
      {...autocompleteProps}
    />
  )
}
