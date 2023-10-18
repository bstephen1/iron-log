import { render, screen } from 'lib/testUtils'
import { AsyncSelectorOption } from 'models/AsyncSelectorOption'
import { Status } from 'models/Status'
import { ComponentProps } from 'react'
import { expect, it, vi } from 'vitest'
import AsyncSelector from './AsyncSelector'

const mockConstructor = vi.fn()
const mockMutate = vi.fn()
const mockHandleChange = vi.fn()
const mockAddNewItem = vi.fn()

const placeholder = 'placeholder'

const TestSelector = (
  props: Partial<ComponentProps<typeof AsyncSelector<AsyncSelectorOption>>>
) => (
  <AsyncSelector
    handleChange={mockHandleChange}
    mutateOptions={mockMutate}
    Constructor={mockConstructor}
    addNewItem={mockAddNewItem}
    placeholder={placeholder}
    {...props}
  />
)

it('sorts options by status', async () => {
  const unsortedOptions: AsyncSelectorOption[] = [
    { _id: '1', name: '1', status: Status.active },
    { _id: '2', name: '2', status: Status.archived },
    { _id: '3', name: '3', status: Status.active },
    { _id: '4', name: '4', status: Status.archived },
    { _id: '5', name: '5', status: Status.active },
  ]
  const { user } = render(<TestSelector options={unsortedOptions} />)

  // open dropdown menu
  await user.click(screen.getByPlaceholderText(placeholder))
  await user.keyboard('[DownArrow]')

  // There should only be one group for each status.
  // If left unsorted, only adjacent items with the same status would group together.
  expect(screen.getByText(Status.active)).toBeVisible()
  expect(screen.getByText(Status.archived)).toBeVisible()
})

it('creates new record from "add new" option', async () => {
  const newOption = 'new option'
  const { user } = render(<TestSelector />)

  // type new option
  await user.click(screen.getByPlaceholderText(placeholder))
  await user.paste(newOption)

  // new option appears as text in dropdown (input value is not considered text)
  expect(screen.getByText(newOption)).toBeVisible()

  // select new option
  await user.keyboard('[Enter]')

  expect(mockMutate).toHaveBeenCalled()
  expect(mockAddNewItem).toHaveBeenCalled()
  expect(mockHandleChange).toHaveBeenCalled()
})

it('changes to existing option', async () => {
  const { user } = render(
    <TestSelector options={[{ _id: '1', name: '1', status: Status.active }]} />
  )

  // change to first option
  await user.click(screen.getByPlaceholderText(placeholder))
  await user.keyboard('[Enter]')

  expect(mockMutate).not.toHaveBeenCalled()
  expect(mockAddNewItem).not.toHaveBeenCalled()
  expect(mockHandleChange).toHaveBeenCalled()
})
