import userEvent from '@testing-library/user-event'
import { render, screen, within } from 'lib/testUtils'
import BodyweightInputToggle from './BodyweightInputToggle'
import { vi } from 'vitest'

const handleTypeChange = vi.fn()

it('renders with given type selected', async () => {
  render(<BodyweightInputToggle type="unofficial" {...{ handleTypeChange }} />)

  await userEvent.click(screen.getByRole('button'))

  // ariaLabel isn't doing anything so resorting to testid
  const listItem = await screen.findByTestId('unofficial')

  expect(await within(listItem).findByTestId('CheckIcon')).toBeVisible()
})

it('switches type when different type clicked', async () => {
  handleTypeChange.mockClear()
  render(<BodyweightInputToggle type="unofficial" {...{ handleTypeChange }} />)

  await userEvent.click(screen.getByRole('button'))
  await userEvent.click(await screen.findByText('official weigh-ins'))

  // menu closes on change
  expect(screen.queryByText('official')).not.toBeInTheDocument()
  expect(handleTypeChange).toHaveBeenCalledTimes(1)
  expect(handleTypeChange).toHaveBeenCalledWith('official')
  // the component doesn't store type in state, so it won't change in isolation
})

it('switches type when same type clicked', async () => {
  handleTypeChange.mockClear()
  render(<BodyweightInputToggle type="unofficial" {...{ handleTypeChange }} />)

  await userEvent.click(screen.getByRole('button'))
  await userEvent.click(await screen.findByText('unofficial', { exact: false }))

  expect(screen.queryByText('unofficial')).not.toBeInTheDocument()
  expect(handleTypeChange).toHaveBeenCalledTimes(1)
  expect(handleTypeChange).toHaveBeenCalledWith('unofficial')
})
