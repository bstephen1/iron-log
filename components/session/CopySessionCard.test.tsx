import { expect, it, vi } from 'vitest'
import {
  addRecord,
  fetchRecords,
  fetchSessionLog,
} from '../../lib/backend/mongoService'
import { render, screen, waitFor } from '../../lib/test/rtl'
import { createRecord } from '../../models/Record'
import { createSessionLog } from '../../models/SessionLog'
import CopySessionCard from './CopySessionCard'

it('copies session', async () => {
  const prevRecord = createRecord('2000-01-01')
  vi.mocked(fetchSessionLog).mockResolvedValue(
    createSessionLog('2000-01-01', [prevRecord._id])
  )
  vi.mocked(fetchRecords).mockResolvedValue([prevRecord])
  const { user } = render(<CopySessionCard />)

  await waitFor(() => {
    expect(screen.getByText('Copy session')).toBeEnabled()
  })
  await user.click(screen.getByText('Copy session'))

  expect(vi.mocked(addRecord)).toHaveBeenCalled()
})

it('ignores empty sessions', async () => {
  const { user } = render(<CopySessionCard />)

  await waitFor(() => {
    expect(screen.getByText('Copy session')).toBeEnabled()
  })
  await user.click(screen.getByText('Copy session'))

  expect(screen.getByText(/No session data/)).toBeVisible()

  // change day
  await user.click(screen.getByLabelText(/Choose date/))
  await user.click(screen.getByText('15'))

  // resets button
  expect(screen.getByText('Copy session')).toBeVisible()
})
