// @ts-nocheck
// todo: typing
import { Autocomplete, createFilterOptions } from '@mui/material'
import { useEffect } from 'react'

// this allows the autocomplete to filter options based on what the user is typing
const filter = createFilterOptions<T | NewObjectStub>()

// this component is intended to be ingested as the base layer of a HOC.
export default function SelectorBase<T>({
  value,
  handleChange,
  options,
  categoryFilter,
  mutate,
  NewItemStub,
  ItemConstructor,
  addNewItem,
  ...autocompleteProps
}) {
  useEffect(() => {
    console.log(value)
  }, [value])
  return (
    <Autocomplete<T | NewObjectStub>
      openOnFocus
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      autoHighlight // todo: this sometimes pops up over Category selector for Exercises
      options={options}
      value={value} // todo: this is just undefined currently. Probably will hash out when typing
      isOptionEqualToValue={(a, b) => a.name === b.name}
      getOptionLabel={(option) => option.name}
      onChange={(_, option) => {
        // add the new item if selected
        if (option && !('_id' in option)) {
          const newItem = new ItemConstructor(option.name)
          mutate(options?.concat(newItem))
          addNewItem(newItem)
          handleChange(newItem)
        } else {
          handleChange(option)
        }
      }}
      // was going to pull this out to a separate function but the param type definitions are long and annoying
      filterOptions={(options, params) => {
        const { inputValue } = params
        let filtered = filter(options, params)

        // todo: this is really specific to Exercise, but needs inputValue
        if (categoryFilter) {
          filtered = filtered.filter((option) => {
            return (
              // todo: null out category if selecting something that's not in the category?
              // todo: on clicking category chip in form, setCategory to that value?
              option.name === inputValue || // if you filter out an exercise you can still type it in manually
              option.categories.some(
                (category) => category === categoryFilter.name
              )
            )
          })
        }

        // append an option to add the current input
        const isExisting = options.some((option) => inputValue === option.name)
        if (inputValue && !isExisting) {
          filtered.push(new NewItemStub(inputValue))
        }

        return filtered
      }}
      {...autocompleteProps}
    />
  )
}
