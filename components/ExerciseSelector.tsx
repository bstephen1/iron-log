// @ts-nocheck
// todo: typing
import { Autocomplete } from '@mui/material'
import { useState } from 'react'
import { addExercise, useCategories } from '../lib/frontend/restService'
import Exercise from '../models/Exercise'
import { ExerciseStatusOrder } from '../models/ExerciseStatus'
import CategoryFilter from './CategoryFilter'
import { withAsync } from './withAsync'

function ExerciseSelectorBase({
  exercise,
  setExercise,
  options: exercises,
  categoryFilter,
  mutate,
  ...autocompleteProps
}) {
  // temporarily store the current input in a stub and only create a true Exercise if the stub is selected
  class NewExerciseStub {
    name: string
    status: string
    categories: string[]
    constructor(name: string) {
      this.name = name
      this.status = 'Add New'
    }
  }

  return (
    <Autocomplete<Exercise | NewExerciseStub>
      {...autocompleteProps}
      openOnFocus
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      autoHighlight
      isOptionEqualToValue={(a, b) => a.name === b.name}
      options={
        exercises?.sort(
          (a, b) =>
            ExerciseStatusOrder[a.status] - ExerciseStatusOrder[b.status]
        ) || []
      }
      groupBy={(option) => option.status}
      value={exercise}
      onChange={(_, option) => {
        if (option && !('_id' in option)) {
          const newExercise = new Exercise(option.name)
          mutate(exercises?.concat(newExercise))
          addExercise(newExercise)
          setExercise(newExercise)
        } else {
          setExercise(option)
        }
      }}
      getOptionLabel={(option) => option.name}
      // was going to pull this out to a separate function but the param type definitions are long and annoying
      filterOptions={(options, params) => {
        const filtered = options.filter((option) => {
          console.log(option.categories)
          return (
            !categoryFilter ||
            option.categories.some(
              (category) => category === categoryFilter.name
            )
          )
        })

        const { inputValue } = params

        // append an option to add the current input
        const isExisting = options.some((option) => inputValue === option.name)
        if (inputValue && !isExisting) {
          filtered.push(new NewExerciseStub(inputValue))
        }

        return filtered
      }}
    />
  )
}

// Autocomplete nests a Textfield as a prop, so a second HOC wrapper is needed to add default props
const withDefaults = (Component) => (props) => {
  // const inputRef = useRef<HTMLElement>(null)
  const { categories } = useCategories()
  const [category, setCategory] = useState<Category | null>(null)

  return (
    <Component
      {...props}
      label="Exercises"
      placeholder="Select or Add an Exercise"
      categoryFilter={category}
      // inputRef={inputRef}
      // todo: anchor to the bottom of the input?
      // todo: any way to get label to offset and not shrink with startAdornment? Not officially supported by mui bc "too hard" apparently. Is placeholder an ok comrpromise?
      startAdornment={
        <CategoryFilter {...{ categories, category, setCategory }} />
      }
    />
  )
}

export const ExerciseSelector = withDefaults(withAsync(ExerciseSelectorBase))
