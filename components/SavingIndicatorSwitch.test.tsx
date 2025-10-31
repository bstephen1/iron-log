import { expect, it, vi } from 'vitest'
import { render, screen } from '../lib/util/test/rtl'
import SavingIndicatorSwitch from './SavingIndicatorSwitch'

it('reads value from local storage', async () => {
  vi.stubEnv('NEXT_PUBLIC_SHOW_SAVING', 'true')
  const { user } = render(<SavingIndicatorSwitch />)

  const switchEl = screen.getByRole('switch')
  expect(switchEl).toBeChecked()

  await user.click(switchEl)
  expect(screen.getByRole('switch')).not.toBeChecked()
})
