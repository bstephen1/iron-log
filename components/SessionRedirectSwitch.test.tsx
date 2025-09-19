import { expect, it } from 'vitest'
import { render, screen } from '../lib/testUtils'
import SessionRedirectSwitch from './SessionRedirectSwitch'

it('reads value from local storage', async () => {
  const { user } = render(<SessionRedirectSwitch />)

  const switchEl = screen.getByRole('switch')
  expect(switchEl).toBeChecked()

  await user.click(switchEl)
  expect(screen.getByRole('switch')).not.toBeChecked()
})
