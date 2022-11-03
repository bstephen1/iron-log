// @ts-nocheck
// todo: typing
import { Autocomplete, createFilterOptions } from '@mui/material'
import { addExercise } from '../lib/frontend/restService'
import Exercise from '../models/Exercise'
import { ExerciseStatusOrder } from '../models/ExerciseStatus'
import { withAsync } from './withAsync'

function ExerciseSelectorBase({
  exercise,
  setExercise,
  options: exercises,
  mutate,
  ...autocompleteProps
}) {
  const filter = createFilterOptions<Exercise | NewExerciseStub>()

  // temporarily store the current input in a stub and only create a true Exercise if the stub is selected
  class NewExerciseStub {
    name: string
    status: string
    constructor(name: string) {
      this.name = name
      this.status = 'Add New'
    }
  }

  return (
    <Autocomplete<Exercise | NewExerciseStub>
      {...autocompleteProps}
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
      filterOptions={(options, params) => {
        // was going to pull this out to a separate function but the param type definitions are long and annoying
        const filtered = filter(options, params)
        const { inputValue } = params

        // todo: filter based on status? add filtering adornment?

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

const withDefaults = (Component) => (props) =>
  <Component {...props} label="Exercises" />

export const ExerciseSelector = withDefaults(withAsync(ExerciseSelectorBase))
