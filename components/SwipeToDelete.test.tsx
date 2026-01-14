import { expect, it } from 'vitest'
import { doNothing } from '../lib/frontend/constants'
import { render, screen } from '../lib/test/rtl'
import SwipeToDelete from './SwipeToDelete'

it('does not render swiper when disabled', () => {
  render(
    <SwipeToDelete onDelete={doNothing} disabled>
      <div>child</div>
    </SwipeToDelete>
  )

  expect(screen.queryByText('Delete')).not.toBeInTheDocument()
})

it('renders swiper with child initially visible', () => {
  render(
    <SwipeToDelete onDelete={doNothing} childHeight={20}>
      <div>child</div>
    </SwipeToDelete>
  )

  expect(screen.getByText('child').closest('.swiper-slide')).toHaveClass(
    'swiper-slide-active'
  )
})
