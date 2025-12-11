import type { ComponentProps } from 'react'
import { expect, it, vi } from 'vitest'
import {
  fetchCategories,
  fetchExercises,
} from '../../../lib/backend/mongoService'
import { render, screen } from '../../../lib/test/rtl'
import { createCategory } from '../../../models/AsyncSelectorOption/Category'
import {
  createExercise,
  type Exercise,
} from '../../../models/AsyncSelectorOption/Exercise'
import { Status } from '../../../models/Status'
import ExerciseSelector from './ExerciseSelector'

const mockHandleChange = vi.fn()

const testCategoryName = 'test category'
const testCategory = createCategory(testCategoryName)
const matchingExercise = createExercise('blah', {
  categories: [testCategoryName],
})
const unmatchedExercise = createExercise('yah')

const autocompletePlaceholder = /add new exercise/i
const categoryLabel = /select category/i

const TestSelector = (
  props: Partial<ComponentProps<typeof ExerciseSelector>>
) => (
  <ExerciseSelector
    exercise={null}
    handleChange={mockHandleChange}
    {...props}
  />
)

it('does not open autocomplete when filter menu is open', async () => {
  vi.mocked(fetchCategories).mockResolvedValue([testCategory])
  const { user } = render(<TestSelector />)
  const autocompleteText = /no options/i

  // click open autocomplete
  await user.click(await screen.findByPlaceholderText(autocompletePlaceholder))
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
  vi.mocked(fetchCategories).mockResolvedValue([testCategory])
  vi.mocked(fetchExercises).mockResolvedValue([
    matchingExercise,
    unmatchedExercise,
  ])
  const { user } = render(<TestSelector initialCategory={testCategoryName} />)

  // open autocomplete
  await user.click(await screen.findByPlaceholderText(autocompletePlaceholder))

  expect(screen.getByText(matchingExercise.name)).toBeVisible()
  expect(screen.queryByText(unmatchedExercise.name)).not.toBeInTheDocument()
})

it('unselects exercise if it is not valid for selected category', async () => {
  // Note: for this to have full coverage the category we switch to must
  // have at least one matching exercise.
  // When the component checks "filtered.some(...)", if filtered is an
  // empty array the condition is short circuited.
  const otherCategoryName = 'other'
  vi.mocked(fetchCategories).mockResolvedValue([
    testCategory,
    createCategory(otherCategoryName),
  ])
  vi.mocked(fetchExercises).mockResolvedValue([
    unmatchedExercise,
    matchingExercise,
  ])
  const { user } = render(<TestSelector exercise={unmatchedExercise} />)

  await user.click(await screen.findByLabelText('Select category'))
  await user.click(screen.getByText(testCategoryName))

  // input has cleared
  expect(
    screen.queryByDisplayValue(unmatchedExercise.name)
  ).not.toBeInTheDocument()
})

it('sorts exercises by status', async () => {
  const unsortedExercises: Exercise[] = [
    createExercise('option 1'),
    createExercise('option 2', { status: Status.archived }),
    createExercise('option 3'),
    createExercise('option 4', { status: Status.archived }),
  ]
  vi.mocked(fetchExercises).mockResolvedValue(unsortedExercises)
  const { user } = render(<TestSelector />)

  // open autocomplete
  await user.click(await screen.findByPlaceholderText(autocompletePlaceholder))
  // Type a new option. This must be a shared string among all
  // unsortedExercises because the selector filters the options based on the input
  await user.paste('option')

  // There should only be one group for each status.
  // If left unsorted, only adjacent items with the same status would group together.
  // The new option should be appended to the end of the active exercises.
  expect(screen.getByText(Status.active)).toBeVisible()
  expect(screen.getByText(Status.archived)).toBeVisible()
})

it('disables bonus features', async () => {
  const unsortedExercises: Exercise[] = [
    createExercise('option 1'),
    createExercise('option 2', { status: Status.archived }),
    createExercise('option 3'),
    createExercise('option 4', { status: Status.archived }),
  ]
  vi.mocked(fetchExercises).mockResolvedValue(unsortedExercises)
  render(
    <TestSelector disableAddNew hideCategoryFilter initialCategory="cat" />
  )

  expect(screen.queryByPlaceholderText(/or add new/)).not.toBeInTheDocument()
  // category filter is still in the dom, just hidden
  expect(screen.getByText('cat')).not.toBeVisible()
})
