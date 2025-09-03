import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../lib/testUtils'
import {
  type AsyncSelectorOption,
  createAsyncSelectorOption,
} from '../../../models/AsyncSelectorOption'
import { Status } from '../../../models/Status'
import AsyncSelector, { type AsyncSelectorProps } from './AsyncSelector'

const mockHandleChange = vi.fn()
const mockAddNewItem = vi.fn()

const placeholder = 'placeholder'

const TestSelector = (
  props: Partial<AsyncSelectorProps<AsyncSelectorOption, false>>
) => (
  <AsyncSelector
    handleChange={mockHandleChange}
    createOption={createAsyncSelectorOption}
    dbAddProps={{
      addFunction: mockAddNewItem,
    }}
    placeholder={placeholder}
    {...props}
  />
)

it('creates new record from "add new" option', async () => {
  const newOption = 'new option'
  const { user } = render(<TestSelector />)

  // type new option
  await user.click(screen.getByPlaceholderText(placeholder))
  await user.paste(newOption)

  // new option appears as text in dropdown (input value is not considered text)
  expect(screen.getByText(newOption, { exact: false })).toBeVisible()

  // select new option
  await user.keyboard('[Enter]')

  expect(mockAddNewItem).toHaveBeenCalled()
  expect(mockHandleChange).toHaveBeenCalled()
})

it('inits to given value name if provided', async () => {
  const name = 'my value'
  render(<TestSelector value={{ name, status: Status.active, _id: '1' }} />)

  expect(screen.getByDisplayValue(name)).toBeVisible()
})

it('does not show "add new" option when mutateOptions is not provided', async () => {
  const { user } = render(<TestSelector dbAddProps={undefined} />)

  // type new option
  await user.click(screen.getByPlaceholderText(placeholder))
  await user.paste('my option')

  // new option does not appear
  expect(screen.queryByText(/Add/)).not.toBeInTheDocument()
})

it('handles changing to an existing option', async () => {
  const { user } = render(
    <TestSelector options={[{ _id: '1', name: '1', status: Status.active }]} />
  )

  // change to first option
  await user.click(screen.getByPlaceholderText(placeholder))
  await user.keyboard('[Enter]')

  expect(mockAddNewItem).not.toHaveBeenCalled()
  expect(mockHandleChange).toHaveBeenCalled()
})

it('handles a custom filter', async () => {
  const mockHandleFilterChange = vi.fn()
  const { user } = render(
    <TestSelector
      options={[
        { _id: '1', name: 'option 1', status: Status.active },
        { _id: '2', name: 'option 2', status: Status.active },
      ]}
      filterCustom={(v) => v._id === '1'}
      handleFilterChange={mockHandleFilterChange}
    />
  )

  // open dropdown
  await user.click(screen.getByPlaceholderText(placeholder))

  expect(screen.getByText('option 1')).toBeVisible()
  expect(screen.queryByText('option 2')).not.toBeInTheDocument()
  expect(mockHandleFilterChange).toHaveBeenCalled()
})
