import { URI_CATEGORIES } from 'lib/frontend/constants'
import { render, screen, useServerOnce } from 'lib/testUtils'
import Category from 'models/AsyncSelectorOption/Category'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import { ComponentProps } from 'react'
import { expect, it, vi } from 'vitest'
import ExerciseSelector from './ExerciseSelector'

const mockHandleChange = vi.fn()
const mockMutate = vi.fn()
const mockHandleCategoryChange = vi.fn()

const testCategoryName = 'test category'
const testCategory = new Category(testCategoryName)
const matchingExercise = new Exercise('blah')
const unmatchedExercise = new Exercise('yah')
matchingExercise.categories = [testCategoryName]

const autocompletePlaceholder = /add new exercise/i
const categoryLabel = /select category/i

const TestSelector = (
  props: Partial<ComponentProps<typeof ExerciseSelector>>
) => (
  <ExerciseSelector
    exercise={null}
    handleChange={mockHandleChange}
    exercises={[]}
    mutate={mockMutate}
    handleCategoryChange={mockHandleCategoryChange}
    category={null}
    {...props}
  />
)

it('does not open autocomplete when filter menu is open', async () => {
  useServerOnce(URI_CATEGORIES, [testCategory])
  const { user } = render(<TestSelector />)
  const autocompleteText = /no options/i

  // click open autocomplete
  await user.click(screen.getByPlaceholderText(autocompletePlaceholder))
  expect(screen.getByText(autocompleteText)).toBeVisible()

  // click open filter
  await user.click(screen.getByLabelText(categoryLabel))
  expect(screen.getByText(testCategoryName)).toBeVisible()
  expect(screen.queryByText(autocompleteText)).not.toBeInTheDocument()

  // closing menu focuses and opens autocomplete
  await user.keyboard('[Escape]')
  expect(screen.getByText(autocompleteText)).toBeVisible()

  // shifting focus to filter button closes autocomplete
  await user.keyboard('[Shift>][Tab]')
  expect(screen.getByText(categoryLabel)).toBeVisible() // tooltip
  expect(screen.queryByText(autocompleteText)).not.toBeInTheDocument()

  // open filter menu. Wanted to open with space/enter but that wasn't playing nice
  await user.click(screen.getByLabelText(categoryLabel))

  // shifting focus to autocomplete closes filter
  await user.keyboard('[Tab]')
  expect(screen.queryByText(testCategoryName)).not.toBeInTheDocument()
  expect(screen.getByText(autocompleteText)).toBeVisible()
})

it('filters exercises based on category filter', async () => {
  useServerOnce(URI_CATEGORIES, [testCategory])
  const { user } = render(
    <TestSelector
      exercises={[matchingExercise, unmatchedExercise]}
      category={testCategoryName}
    />
  )

  // open autocomplete
  await user.click(screen.getByPlaceholderText(autocompletePlaceholder))

  expect(screen.getByText(matchingExercise.name)).toBeVisible()
  expect(screen.queryByText(unmatchedExercise.name)).not.toBeInTheDocument()
})

it('unselects exercise if it is not valid for selected category', async () => {
  const otherCategoryName = 'other'
  useServerOnce(URI_CATEGORIES, [testCategory, new Category(otherCategoryName)])
  const { user } = render(
    <TestSelector
      exercises={[unmatchedExercise]}
      category={testCategoryName}
      exercise={unmatchedExercise}
    />
  )

  // A category is already selected. We just need to trigger a category change
  // (which won't do anything because handleCategoryChange is being mocked)
  await user.click(screen.getByLabelText(categoryLabel))
  await user.click(screen.getByText(otherCategoryName))

  // autocomplete has reset
  expect(screen.getByPlaceholderText(autocompletePlaceholder)).toBeVisible()
  expect(mockHandleChange).toHaveBeenCalledWith(null)
})
