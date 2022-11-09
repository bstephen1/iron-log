// @ts-nocheck
// todo: typing
import { useState } from 'react'
import { addExercise, useCategories } from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import { ExerciseStatusOrder } from '../../models/ExerciseStatus'
import CategoryFilter from '../CategoryFilter'
import SelectorBase from './SelectorBase'
import withAsync from './withAsync'

const withExercise = (Component) => (props) => {
  // const inputRef = useRef<HTMLElement>(null)
  const { categories } = useCategories()
  const [category, setCategory] = useState<Category | null>(null)

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
    <Component
      {...props}
      options={
        props.exercises?.sort(
          (a, b) =>
            ExerciseStatusOrder[a.status] - ExerciseStatusOrder[b.status]
        ) || []
      }
      label="Exercise"
      groupBy={(option) => option.status}
      placeholder="Select or Add an Exercise"
      categoryFilter={category}
      NewItemStub={NewExerciseStub}
      ItemConstructor={Exercise}
      addNewItem={addExercise}
      // inputRef={inputRef}
      // todo: anchor to the bottom of the input?
      // todo: any way to get label to offset and not shrink with startAdornment? Not officially supported by mui bc "too hard" apparently. Is placeholder an ok comrpromise?
      startAdornment={
        <CategoryFilter {...{ categories, category, setCategory }} />
      }
    />
  )
}

export const ExerciseSelector = withExercise(withAsync(SelectorBase<Exercise>))
