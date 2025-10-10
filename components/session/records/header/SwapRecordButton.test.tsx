import { beforeEach, expect, it, vi } from 'vitest'
import {
  fetchSessionLog,
  upsertSessionLog,
} from '../../../../lib/backend/mongoService'
import { render, screen } from '../../../../lib/testUtils'
import { createSessionLog } from '../../../../models/SessionLog'
import SwapRecordButton from './SwapRecordButton'

const testSessionLog = createSessionLog('2000-01-01', ['one', 'two', 'three'])

vi.mock('swiper/react', () => ({
  useSwiper: () => ({
    update: vi.fn(),
    slideTo: vi.fn(),
    // This is a bit contrived for the test. We must ensure the correct
    // number of slides is being rendered. This component would be better
    // to test e2e.
    slides: ['one', 'two', 'three', 'add record'],
  }),
}))

beforeEach(() => {
  vi.mocked(fetchSessionLog).mockResolvedValue(testSessionLog)
})

it('swipes left', async () => {
  const { user } = render(<SwapRecordButton direction="left" index={1} />)

  await user.click(screen.getByLabelText(/Move current record/))

  expect(upsertSessionLog).toHaveBeenCalledWith({
    ...testSessionLog,
    records: ['two', 'one', 'three'],
  })
})

it('swipes right', async () => {
  const { user } = render(<SwapRecordButton direction="right" index={1} />)

  await user.click(screen.getByLabelText(/Move current record/))

  expect(upsertSessionLog).toHaveBeenCalledWith({
    ...testSessionLog,
    records: ['one', 'three', 'two'],
  })
})

it('disables on leftmost record', async () => {
  render(<SwapRecordButton direction="left" index={0} />)

  expect(screen.getByRole('button')).toBeDisabled()
})

it('disables on rightmost record', async () => {
  render(<SwapRecordButton direction="right" index={2} />)

  expect(screen.getByRole('button')).toBeDisabled()
})

it('handles click when sessionLog is not loaded', async () => {
  vi.mocked(fetchSessionLog).mockResolvedValue(null)
  const { user } = render(<SwapRecordButton direction="left" index={1} />)

  await user.click(screen.getByLabelText(/Move current record/))

  expect(upsertSessionLog).not.toHaveBeenCalled()
})
