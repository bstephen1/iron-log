import { type TextFieldProps } from '@mui/material/TextField'
import { useState } from 'react'
import CategoryFilter from '../../../components/CategoryFilter'
import { addExercise } from '../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../lib/frontend/constants'
import {
  useAddMutation,
  useCategories,
  useExercises,
} from '../../../lib/frontend/restService'
import {
  createExercise,
  type Exercise,
} from '../../../models/AsyncSelectorOption/Exercise'
import { StatusOrder } from '../../../models/Status'
import AsyncSelector, { type AsyncSelectorProps } from './AsyncSelector'

type ExerciseSelectorProps<DisableClearable extends boolean | undefined> = {
  exercise: DisableClearable extends true ? Exercise : Exercise | null
  handleChange: (
    value: DisableClearable extends true ? Exercise : Exercise | null
  ) => void
  variant?: TextFieldProps['variant']
  /** If this is omitted the category filter will not be rendered */
  handleCategoryFilterChange?: (category: string | null) => void
  categoryFilter?: string | null
  disableAddNew?: boolean
} & Partial<AsyncSelectorProps<Exercise, DisableClearable>>

export default function ExerciseSelector<
  DisableClearable extends boolean | undefined,
>({
  exercise,
  handleCategoryFilterChange,
  categoryFilter = null,
  disableAddNew,
  ...asyncSelectorProps
}: ExerciseSelectorProps<DisableClearable>) {
  const exercises = useExercises()
  const categories = useCategories()
  const mutate = useAddMutation({
    queryKey: [QUERY_KEYS.exercises],
    addFn: addExercise,
  })
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<HTMLElement | null>(
    null
  )

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
      setTimeout(() => asyncSelectorProps.handleChange(null), 0)
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
      addItemMutate={disableAddNew ? undefined : mutate}
      label="Exercise"
      placeholder={`Select${!disableAddNew ? ' or add new' : ''} exercise`}
      filterCustom={filterCategories}
      handleFilterChange={handleFilterChange}
      adornmentOpen={!!categoryAnchorEl}
      createOption={createExercise}
      // we have to spread because autocomplete considers the options to be readonly, and sort() mutates the array
      options={[...exercises.data].sort(
        (a, b) => StatusOrder[a.status] - StatusOrder[b.status]
      )}
      groupBy={(option) => option.status}
      startAdornment={
        handleCategoryFilterChange && (
          <CategoryFilter
            // standard variant bizzarely removes left input padding. Easier to add it back to Category filter
            sx={{ pr: asyncSelectorProps.variant === 'standard' ? 1 : 0 }}
            {...{
              categories: categories.names,
              category: categoryFilter,
              setCategory: handleCategoryFilterChange,
              anchorEl: categoryAnchorEl,
              setAnchorEl: setCategoryAnchorEl,
            }}
          />
        )
      }
    />
  )
}
