import { it, expect, vi } from 'vitest'
import { render, screen } from '../lib/testUtils'
import Tooltip from './Tooltip'

it('provides accessible tooltip label', () => {
  render(
    <Tooltip title="tooltip">
      <button />
    </Tooltip>
  )

  // the label should be attached to the button element
  expect(screen.getByLabelText('tooltip')).toBeEnabled()
})

it('does not log mui warning if button is disabled', () => {
  const consoleSpy = vi.spyOn(console, 'warn')
  render(
    <Tooltip title="tooltip">
      <button disabled />
    </Tooltip>
  )

  // button still has accessible label
  expect(screen.getByLabelText('tooltip')).toBeDisabled()
  // but no warning
  expect(consoleSpy).not.toHaveBeenCalled()
})
