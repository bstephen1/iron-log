import { useState } from 'react'
import { KeyedMutator } from 'swr'
import { addExercise, useCategories } from '../../../lib/frontend/restService'
import Category from '../../../models/Category'
import Exercise from '../../../models/Exercise'
import { ExerciseStatusOrder } from '../../../models/ExerciseStatus'
import { NamedStub } from '../../../models/NamedObject'
import CategoryFilter from '../../CategoryFilter'
import withAsync from '../withAsync'
import SelectorBase from './SelectorBase'

interface WithExerciseProps {
  exercise: Exercise | null
  handleChange: (value: Exercise | null) => void
  exercises: Exercise[] | undefined
  mutate: KeyedMutator<Exercise[]>
}
function withExercise(Component: typeof SelectorBase<Exercise>) {
  return function ({ exercise, exercises, ...props }: WithExerciseProps) {
    // const inputRef = useRef<HTMLElement>(null)
    const { categories } = useCategories()
    const [categoryFilter, setCategoryFilter] = useState<Category | null>(null)

    // temporarily store the current input in a stub and only create a true Exercise if the stub is selected
    class ExerciseStub implements NamedStub {
      name: string
      status: string
      constructor(name: string) {
        this.name = name
        this.status = 'Add New'
      }
    }

    // todo: null out category if selecting something that's not in the category?
    // todo: on clicking category chip in form, setCategory to that value?
    const filterCategories = (exercise: Exercise, inputValue: string) => {
      return (
        !categoryFilter ||
        exercise.name === inputValue || // if you filter out an exercise you can still type it in manually
        exercise.categories.some((category) => category === categoryFilter.name)
      )
    }

    return (
      <Component
        {...props}
        value={exercise}
        options={
          exercises?.sort(
            (a, b) =>
              ExerciseStatusOrder[a.status] - ExerciseStatusOrder[b.status]
          ) || []
        }
        label="Exercise"
        groupBy={(option) => option.status}
        placeholder="Select or Add an Exercise"
        filterCustom={filterCategories}
        StubConstructor={ExerciseStub}
        Constructor={Exercise}
        addNewItem={addExercise}
        // inputRef={inputRef}
        // todo: anchor to the bottom of the input?
        // todo: any way to get label to offset and not shrink with startAdornment? Not officially supported by mui bc "too hard" apparently. Is placeholder an ok comrpromise?
        startAdornment={
          <CategoryFilter
            {...{ categories, categoryFilter, setCategoryFilter }}
          />
        }
      />
    )
  }
}

export const ExerciseSelector = withExercise(withAsync(SelectorBase<Exercise>))
