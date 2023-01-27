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
  /** This function can be used to reset the input value to null
   * based on the current options in the dropdown */
  handleFilterChange?: (options: (C | NamedStub)[]) => void
  /** standard autocomplete onChange() callback */
  handleChange: (value: C | null) => void
  /** locally mutate options when adding a new item. Changes the stub S to a new full item C. Invoked after addNewItem().  */
  mutateOptions: KeyedMutator<C[]>
  /** constructor for "add new item" stub option that updates as a user types. */
  StubConstructor: new (name: string) => S
  /** constructor for the full object.  */
  Constructor: new (name: string) => C
  /**  function to add new C (created from stub) to db */
  addNewItem: (value: C) => Promise<any>
  /** have to explicitly declare options is C[] or Autocomplete will think it's (C | S)[].
   * Options is the db res, so will not include the keyless Stub value */
  options?: C[]
  /**  withAsync() uses this. It's too cumbersome trying to extend withAsync's props on top of extending SelectorBase so it's included here.  */
  adornmentOpen?: boolean
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
      handleHomeEndKeys
      autoHighlight // todo: this sometimes pops up over Category selector for Exercises
      options={options || []}
      // value={value} // todo: this is just undefined currently. Probably will hash out when typing
      // todo: this throws a warning when updating names.... but can't use _id, that's the whole point of namedStubs! Or should the stubs actually generate ids...?
      isOptionEqualToValue={(a, b) => a.name === b.name}
      getOptionLabel={(option) => option.name}
      onChange={async (_, option) => {
        // add the new item if selected
        if (option && !('_id' in option)) {
          const newItem = new Constructor(option.name)
          await addNewItem(newItem)
          mutateOptions(options?.concat(newItem))
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
        const isExisting = options.some(
          (option) => inputValue.toLowerCase() === option.name.toLowerCase()
        )
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
