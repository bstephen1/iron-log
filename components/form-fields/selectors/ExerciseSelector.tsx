import type { TextFieldProps } from '@mui/material/TextField'
import { Activity, useState } from 'react'
import CategoryFilter from '../../../components/CategoryFilter'
import { addExercise } from '../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../lib/frontend/constants'
import { useAddMutation } from '../../../lib/frontend/data/useMutation'
import {
  useCategoryNames,
  useExercisesNew,
} from '../../../lib/frontend/data/useQuery'
import {
  createExercise,
  type Exercise,
} from '../../../models/AsyncSelectorOption/Exercise'
import AsyncSelector, { type AsyncSelectorProps } from './AsyncSelector'

type ExerciseSelectorProps<DisableClearable extends boolean | undefined> = {
  exercise: DisableClearable extends true ? Exercise : Exercise | null
  handleChange: (
    value: DisableClearable extends true ? Exercise : Exercise | null
  ) => void
  variant?: TextFieldProps['variant']
  hideCategoryFilter?: boolean
  initialCategory?: string
  disableAddNew?: boolean
} & Partial<AsyncSelectorProps<Exercise, DisableClearable>>

export default function ExerciseSelector<
  DisableClearable extends boolean | undefined,
>({
  exercise,
  hideCategoryFilter,
  initialCategory,
  disableAddNew,
  ...asyncSelectorProps
}: ExerciseSelectorProps<DisableClearable>) {
  const exercises = useExercisesNew()
  const categoryNames = useCategoryNames()
  const mutate = useAddMutation({
    queryKey: [QUERY_KEYS.exercises],
    addFn: addExercise,
  })
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<HTMLElement | null>(
    null
  )
  const [categoryFilter, setCategoryFilter] = useState(initialCategory ?? null)
  const [inputValue, setInputValue] = useState(exercise?.name ?? '')

  const handleFilterChange = (filtered: Exercise[]) => {
    // if a category is selected and the existing exercise is not in that category, erase the input value.
    if (
      categoryFilter &&
      exercise &&
      !filtered.some((item) => item.name === exercise.name)
    ) {
      // This was causing a mysterious error for updating a component while
      // rendering a different component.
      // Not sure why but wrapping it in a setTimeout() fixes it.
      // See: https://stackoverflow.com/a/69236626
      setTimeout(() => setInputValue(''), 0)
    }
  }

  const filterCategories = (exercise: Exercise) => {
    return (
      !categoryFilter ||
      exercise.categories.some((name) => name === categoryFilter)
    )
  }

  return (
    <AsyncSelector
      {...asyncSelectorProps}
      value={exercise}
      inputValue={inputValue}
      onInputChange={(_, newValue) => setInputValue(newValue)}
      addItemMutate={disableAddNew ? undefined : mutate}
      label="Exercise"
      placeholder={`Select${!disableAddNew ? ' or add new' : ''} exercise`}
      filterCustom={filterCategories}
      handleFilterChange={handleFilterChange}
      adornmentOpen={!!categoryAnchorEl}
      createOption={createExercise}
      options={exercises}
      groupBy={(option) => option.status}
      startAdornment={
        <Activity mode={hideCategoryFilter ? 'hidden' : 'visible'}>
          <CategoryFilter
            // standard variant bizzarely removes left input padding. Easier to add it back to Category filter
            sx={{ pr: asyncSelectorProps.variant === 'standard' ? 1 : 0 }}
            {...{
              categories: categoryNames,
              category: categoryFilter,
              setCategory: setCategoryFilter,
              anchorEl: categoryAnchorEl,
              setAnchorEl: setCategoryAnchorEl,
            }}
          />
        </Activity>
      }
    />
  )
}
