import { createFilterOptions } from '@mui/material'
import { useState } from 'react'
import { KeyedMutator } from 'swr'
import AsyncAutocomplete, {
  AsyncAutocompleteProps,
} from '../../../components/AsyncAutocomplete'
import { AsyncSelectorOption } from '../../../models/AsyncSelectorOption'
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

export interface AsyncSelectorProps<C extends AsyncSelectorOption>
  extends AsyncAutocompleteProps<C | SelectorStub, false> {
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
  const filter = createFilterOptions<C | SelectorStub>()
  // This is used to track the input value to allow a new C to be created based on the current input.
  // Originally it was a separate stub class with just the name but now it is a full object of the
  // given generic type so that it can preserve the _id field across name mutations.
  // The key is that newOption and newOptionStub must share their _id. The normal constructors don't
  // allow for manually providing an _id so we use a temp stub class which does.
  const [newOption, setNewOption] = useState(new Constructor(''))
  const [newOptionStub, setNewOptionStub] = useState(
    new SelectorStub(newOption._id)
  )
  const [inputValue, setInputValue] = useState(
    asyncAutocompleteProps.value?.name ?? ''
  )

  const resetNewOption = () => {
    const newObj = new Constructor('')
    setNewOption(newObj)
    setNewOptionStub(new SelectorStub(newObj._id))
  }

  return (
    <AsyncAutocomplete
      // Autocomplete has a bug where the input inits as null even if it has a preset value.
      // By making inputValue controlled we can provide an initial value to avoid this. See:
      // https://github.com/mui/material-ui/issues/19423#issuecomment-639659875
      // https://stackoverflow.com/a/65679069
      // https://github.com/mui/material-ui/issues/20939
      inputValue={inputValue}
      onInputChange={(_, value) => setInputValue(value)}
      openOnFocus
      fullWidth
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      autoHighlight
      options={
        // have to spread options since it is readonly and sort() mutates the array
        [...options].sort(
          (a, b) =>
            SelectorStatusOrder[a.status] - SelectorStatusOrder[b.status]
        )
      }
      isOptionEqualToValue={(option, value) => option._id === value._id}
      getOptionLabel={(option) => option.name}
      groupBy={(option) => option.status}
      onChange={async (_, option) => {
        // add the new record to db if stub is selected
        if (option instanceof SelectorStub) {
          if (addNewDisabled) return

          newOption.name = newOptionStub.name
          // stub should only ever be a single item at the last index, but filter to be sure.
          // Typescript doesn't recognize the type narrowing though...
          const stubless = options.filter(
            (cur) => !(cur instanceof SelectorStub)
          ) as C[]

          // todo: should be able to use a function to modify the return to concat the new option
          // Note addNewItem only returns the single new option, so we can't
          // combine it into mutateOptions, which needs the full options array
          mutateOptions(stubless.concat(newOption), { revalidate: false })
          await addNewItem(newOption)
          mutateOptions()

          handleChange(newOption)
          resetNewOption()
        } else {
          handleChange(option)
        }
      }}
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

        if (addNewDisabled) return filtered

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
      {...asyncAutocompleteProps}
    />
  )
}
