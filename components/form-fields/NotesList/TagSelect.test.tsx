import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../lib/testUtils'
import TagSelect from './TagSelect'

const mockhandleUpdate = vi.fn()
const tag = 'tag1'

it('shows checkboxes if multiple is enabled', async () => {
  const { user } = render(
    <TagSelect handleUpdate={mockhandleUpdate} options={[tag]} multiple />
  )

  await user.click(screen.getByRole('combobox'))

  expect(screen.getByText(tag)).toBeVisible()
  expect(screen.getByTestId('CheckBoxOutlineBlankIcon')).toBeVisible()
})

it('does not show checkboxes if multiple is disabled', async () => {
  const { user } = render(
    <TagSelect handleUpdate={mockhandleUpdate} options={[tag]} />
  )

  await user.click(screen.getByRole('combobox'))

  expect(screen.getByText(tag)).toBeVisible()
  expect(
    screen.queryByTestId('CheckBoxOutlineBlankIcon')
  ).not.toBeInTheDocument()
})
