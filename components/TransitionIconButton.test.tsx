import { expect, it } from 'vitest'
import { render, screen } from '../lib/test/rtl'
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
