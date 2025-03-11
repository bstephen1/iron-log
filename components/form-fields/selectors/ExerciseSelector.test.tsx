import { ComponentProps } from 'react'
import { vi } from 'vitest'
import { URI_CATEGORIES } from '../../../lib/frontend/constants'
import { render, screen, useServer } from '../../../lib/testUtils'
import {
  createExercise,
  Exercise,
} from '../../../models/AsyncSelectorOption/Exercise'
import { Status } from '../../../models/Status'
import ExerciseSelector from './ExerciseSelector'
import { createCategory } from '../../../models/AsyncSelectorOption/Category'

const mockHandleChange = vi.fn()
const mockMutate = vi.fn()
const mockHandleCategoryChange = vi.fn()

const testCategoryName = 'test category'
const testCategory = createCategory(testCategoryName)
const matchingExercise = createExercise('blah')
const unmatchedExercise = createExercise('yah')
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
  useServer(URI_CATEGORIES, [testCategory])
  const { user } = render(<TestSelector />)
  const autocompleteText = /no options/i

  // click open autocomplete
  await user.click(screen.getByPlaceholderText(autocompletePlaceholder))
  expect(screen.getByText(autocompleteText)).toBeVisible()

  // click open filter
  await user.click(screen.getByLabelText(categoryLabel))
  expect(screen.getByText(testCategoryName)).toBeVisible()
  expect(screen.queryByText(autocompleteText)).not.toBeInTheDocument()

  // closing menu focuses and opens autocomplete (note: this presumes "openOnFocus" is enabled)
  await user.keyboard('[Escape]')
  expect(screen.getByText(autocompleteText)).toBeVisible()

  // shifting focus closes autocomplete
  await user.keyboard('[Tab]')
  expect(screen.queryByText(autocompleteText)).not.toBeInTheDocument()

  // open filter menu. Wanted to open with space/enter but that wasn't playing nice
  await user.click(screen.getByLabelText(categoryLabel))

  // shifting focus to autocomplete closes filter
  await user.keyboard('[Tab]')
  expect(screen.queryByText(testCategoryName)).not.toBeInTheDocument()
  expect(screen.getByText(autocompleteText)).toBeVisible()
})

it('filters exercises based on category filter', async () => {
  useServer(URI_CATEGORIES, [testCategory])
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
  useServer(URI_CATEGORIES, [testCategory, createCategory(otherCategoryName)])
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

it('sorts exercises by status', async () => {
  const unsortedExercises: Exercise[] = [
    createExercise('option 1'),
    createExercise('option 2', { status: Status.archived }),
    createExercise('option 3'),
    createExercise('option 4', { status: Status.archived }),
  ]
  const { user } = render(<TestSelector exercises={unsortedExercises} />)

  // open autocomplete
  await user.click(screen.getByPlaceholderText(autocompletePlaceholder))
  // Type a new option. This must be a shared string among all
  // unsortedExercises because the selector filters the options based on the input
  await user.paste('option')

  // There should only be one group for each status.
  // If left unsorted, only adjacent items with the same status would group together.
  // The new option should be appended to the end of the active exercises.
  expect(screen.getByText(Status.active)).toBeVisible()
  expect(screen.getByText(Status.archived)).toBeVisible()
})
