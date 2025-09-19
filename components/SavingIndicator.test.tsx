import { useIsMutating } from '@tanstack/react-query'
import { expect, it, vi } from 'vitest'
import { render, screen } from '../lib/testUtils'
import SavingIndicator from './SavingIndicator'

vi.mock('@tanstack/react-query')

it('is visible when saving', () => {
  vi.mocked(useIsMutating).mockReturnValue(1)
  render(<SavingIndicator />, { disableLayout: true })

  expect(screen.getByLabelText('Saving...')).toBeVisible()
  expect(screen.getByTestId('SaveIcon')).toBeVisible()
})

it('is not visible when not saving', () => {
  vi.mocked(useIsMutating).mockReturnValue(0)
  render(<SavingIndicator />, { disableLayout: true })

  expect(screen.getByLabelText('Changes saved')).toBeVisible()
  expect(screen.queryByTestId('SaveIcon')).not.toBeInTheDocument()
})
