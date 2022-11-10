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

interface ExerciseSelectorProps {
  exercise: Exercise | null
  handleChange: (value: Exercise | null) => void
  exercises: Exercise[] | undefined
  mutate: KeyedMutator<Exercise[]>
}
const withExercise =
  (Component: typeof SelectorBase<Exercise>) =>
  ({ exercise, exercises, ...props }: ExerciseSelectorProps) => {
    // const inputRef = useRef<HTMLElement>(null)
    const { categories } = useCategories()
    const [category, setCategory] = useState<Category | null>(null)

    // temporarily store the current input in a stub and only create a true Exercise if the stub is selected
    class ExerciseStub implements NamedStub {
      name: string
      status: string
      constructor(name: string) {
        this.name = name
        this.status = 'Add New'
      }
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
        categoryFilter={category}
        StubConstructor={ExerciseStub}
        Constructor={Exercise}
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
