import { expect, it } from 'vitest'
import { render, screen } from '../../lib/test/rtl'
import RecordCardSkeleton from './RecordCardSkeleton'

it('renders with content and title', () => {
  render(<RecordCardSkeleton title="title" Content={<div>content</div>} />)

  expect(screen.getByText('title')).toBeVisible()
  expect(screen.getByText('content')).toBeVisible()
})

it('renders default skeleton', () => {
  render(<RecordCardSkeleton showSetButton />)

  expect(screen.getByLabelText(/loading/i)).toBeVisible()
})
