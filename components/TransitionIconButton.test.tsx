import { render, screen } from '../lib/testUtils'
import TransitionIconButton from './TransitionIconButton'

it('is visible', () => {
  render(
    <TransitionIconButton isVisible>
      <div>text</div>
    </TransitionIconButton>
  )

  expect(screen.getByText('text')).toBeVisible()
})

it('is not visible', () => {
  render(
    <TransitionIconButton>
      <div>text</div>
    </TransitionIconButton>
  )

  expect(screen.getByText('text')).not.toBeVisible()
})

it('provides accessible tooltip label', () => {
  render(
    <TransitionIconButton isVisible tooltip="tooltip">
      <div>text</div>
    </TransitionIconButton>
  )

  // the label should be attached to the button element
  expect(screen.getByLabelText('tooltip')).toBeEnabled()
})

it('does not show label if button is disabled', () => {
  render(
    <TransitionIconButton isVisible tooltip="tooltip" disabled>
      <div>text</div>
    </TransitionIconButton>
  )

  expect(screen.queryByLabelText('tooltip')).not.toBeInTheDocument()
})
