import { expect, it, vi } from 'vitest'
import { render, screen, within } from '../../../lib/test/rtl'
import BodyweightInputToggle from './BodyweightInputToggle'

const handleTypeChange = vi.fn()

it('renders with given type selected', async () => {
  const { user } = render(
    <BodyweightInputToggle type="unofficial" {...{ handleTypeChange }} />
  )

  await user.click(screen.getByTestId('ScaleOutlinedIcon'))

  // ariaLabel isn't doing anything so resorting to testid
  const listItem = await screen.findByTestId('unofficial')

  expect(await within(listItem).findByTestId('CheckIcon')).toBeVisible()
})

it('switches type when different type clicked', async () => {
  handleTypeChange.mockClear()
  const { user } = render(
    <BodyweightInputToggle type="unofficial" {...{ handleTypeChange }} />
  )

  await user.click(screen.getByTestId('ScaleOutlinedIcon'))
  await user.click(await screen.findByText('official weigh-ins'))

  // menu closes on change
  expect(screen.queryByText('official')).not.toBeInTheDocument()
  expect(handleTypeChange).toHaveBeenCalledTimes(1)
  expect(handleTypeChange).toHaveBeenCalledWith('official')
  // the component doesn't store type in state, so it won't change in isolation
})

it('switches type when same type clicked', async () => {
  handleTypeChange.mockClear()
  const { user } = render(
    <BodyweightInputToggle type="unofficial" {...{ handleTypeChange }} />
  )

  await user.click(screen.getByTestId('ScaleOutlinedIcon'))
  await user.click(await screen.findByText(/unofficial/))

  expect(screen.queryByText('unofficial')).not.toBeInTheDocument()
  expect(handleTypeChange).toHaveBeenCalledTimes(1)
  expect(handleTypeChange).toHaveBeenCalledWith('unofficial')
})
