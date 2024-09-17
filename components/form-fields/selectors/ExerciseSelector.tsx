import { TextFieldProps } from '@mui/material'
import { useState } from 'react'
import { KeyedMutator } from 'swr'
import CategoryFilter from '../../../components/CategoryFilter'
import { addExercise, useCategories } from '../../../lib/frontend/restService'
import Exercise from '../../../models/AsyncSelectorOption/Exercise'
import AsyncSelector, { AsyncSelectorProps } from './AsyncSelector'
import { StatusOrder } from '../../../models/Status'

type ExerciseSelectorProps = {
  exercise: Exercise | null
  handleChange: (value: Exercise | null) => void
  /** used for autocomplete options, which are considered readonly */
  exercises?: readonly Exercise[]
  /** if provided, allows for creating new exercises from typed input */
  mutate?: KeyedMutator<Exercise[]>
  variant?: TextFieldProps['variant']
  /** If this is omitted the category filter will not be rendered */
  handleCategoryChange?: (category: string | null) => void
  category?: string | null
} & Partial<AsyncSelectorProps<Exercise>>
export default function ExerciseSelector({
  exercise,
  exercises = [],
  mutate,
  handleCategoryChange,
  category = null,
  ...asyncSelectorProps
}: ExerciseSelectorProps) {
  const { categoryNames } = useCategories()
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<HTMLElement | null>(
    null,
  )

  const handleFilterChange = (filtered: Exercise[]) => {
    // if a category is selected and the existing exercise is not in that category, erase the input value.
    if (
      category &&
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
    return !category || exercise.categories.some((name) => name === category)
  }

  return (
    <AsyncSelector
      {...asyncSelectorProps}
      value={exercise || null} // need to reduce undefined | null to just null to avoid switching to uncontrolled
      mutateOptions={mutate}
      label="Exercise"
      placeholder={`Select${!!mutate ? ' or add new' : ''} exercise`}
      filterCustom={filterCategories}
      handleFilterChange={handleFilterChange}
      adornmentOpen={!!categoryAnchorEl}
      Constructor={Exercise}
      addNewItem={addExercise}
      // we have to spread because autocomplete considers the options to be readonly, and sort() mutates the array
      options={[...exercises].sort(
        (a, b) => StatusOrder[a.status] - StatusOrder[b.status],
      )}
      groupBy={(option) => option.status}
      startAdornment={
        handleCategoryChange && (
          <CategoryFilter
            // standard variant bizzarely removes left input padding. Easier to add it back to Category filter
            sx={{ pr: asyncSelectorProps.variant === 'standard' ? 1 : 0 }}
            {...{
              categories: categoryNames,
              category,
              setCategory: handleCategoryChange,
              anchorEl: categoryAnchorEl,
              setAnchorEl: setCategoryAnchorEl,
            }}
          />
        )
      }
    />
  )
}
