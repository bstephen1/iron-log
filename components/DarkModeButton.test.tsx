import { expect, it } from 'vitest'
import { render, screen } from '../lib/util/test/rtl'
import DarkModeButton from './DarkModeButton'

it('swaps modes', async () => {
  const { user } = render(<DarkModeButton />)

  await user.click(screen.getByLabelText(/dark mode/))
  await user.click(screen.getByLabelText(/light mode/))

  expect(screen.getByLabelText(/dark mode/)).toBeVisible()
})
