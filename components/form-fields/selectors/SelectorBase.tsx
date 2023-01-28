import { Autocomplete, createFilterOptions, TextField } from '@mui/material'
import { useMemo, useState } from 'react'
import { KeyedMutator } from 'swr'
import { GenericAutocompleteProps } from '../../../lib/util'
import { SelectorBaseOption } from '../../../models/SelectorBaseOption'
import { StatusOrder } from '../../../models/Status'

/** A stub to track the input value so it can be added to the db as a new record.
 * The stub uses a proprietary "Add New" status only available in SelectorBase.
 */
class SelectorStub {
  readonly status: AddNewStatus.new
  constructor(public readonly _id: string, public name: string = '') {
    this.status = AddNewStatus.new
  }
}

// can combine this with Status with a union type per below, but that wasn't needed
// type SelectorStatus = Status | AddNewStatus
enum AddNewStatus {
  new = 'Add New',
}

const SelectorStatusOrder = {
  ...StatusOrder,
  [AddNewStatus.new]: Infinity,
}

export interface SelectorBaseProps<C>
  // Partial because this component defines all required Autocomplete props.
  // Any explicitly given AutocompleteProps will override the defaults
  extends Partial<GenericAutocompleteProps<C | SelectorStub>> {
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
  Constructor: new (name: string) => C
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
  const filter = useMemo(() => createFilterOptions<C | SelectorStub>(), [])
  // This is used to track the input value to allow a new C to be created based on the current input.
  // Originally it was a separate stub class with just the name but now it is a full object of the
  // given generic type so that it can preserve the _id field across name mutations.
  // The key is that newOption and newOptionStub must share their _id. The normal constructors don't
  // allow for manually providing an _id so we use a temp stub class which does.
  const [newOption, setNewOption] = useState(new Constructor(''))
  const [newOptionStub, setNewOptionStub] = useState(
    new SelectorStub(newOption._id)
  )

  const resetNewOption = () => {
    setNewOption(new Constructor(''))
    setNewOptionStub(new SelectorStub(newOption._id))
  }

  return (
    <Autocomplete<C | SelectorStub>
      renderInput={(params) => <TextField {...params} label={label} />}
      openOnFocus
      fullWidth
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      autoHighlight
      options={
        // have to spread options since it is readonly and sort() mutates the array
        !!options
          ? [...options].sort(
              (a, b) =>
                SelectorStatusOrder[a.status] - SelectorStatusOrder[b.status]
            )
          : []
      }
      isOptionEqualToValue={(option, value) => option._id === value._id}
      getOptionLabel={(option) => option.name}
      groupBy={(option) => option.status}
      onChange={async (_, option) => {
        // add the new record to db if stub is selected
        if (option instanceof SelectorStub) {
          newOption.name = newOptionStub.name
          await addNewItem(newOption)
          // stub should only ever be a single item at the last index, but filter to be sure.
          // Typescript doesn't recognize the type narrowing though...
          const stubless = (options?.filter(
            (cur) => !(cur instanceof SelectorStub)
          ) || []) as C[]
          mutateOptions(stubless.concat(newOption))
          handleChange(newOption)
          resetNewOption()
        } else {
          handleChange(option)
        }
      }}
      // todo: extract Add New to yet another HOC? Can add to ComboBoxField
      filterOptions={(options, params) => {
        const { inputValue } = params
        let filtered = filter(options, params)

        if (filterCustom) {
          filtered = filtered.filter(
            (option) =>
              !(option instanceof SelectorStub) &&
              filterCustom(option, inputValue)
          )
          // invoke this before we append SelectorStub to ensure filtered is type C[].
          // Typescript doesn't recognize the type guard above but we know any SelectorStubs have been filtered out here.
          handleFilterChange?.(filtered as C[])
        }

        // append the "add new" option if input is not an existing option
        const isExisting = options.some(
          (option) => inputValue.toLowerCase() === option.name.toLowerCase()
        )
        if (inputValue && !isExisting) {
          newOptionStub.name = inputValue
          filtered.push(newOptionStub)
        }

        return filtered
      }}
      {...autocompleteProps}
    />
  )
}
