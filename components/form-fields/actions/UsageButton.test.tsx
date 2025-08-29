import { expect, it, vi } from 'vitest'
import { fetchRecords } from '../../../lib/backend/mongoService'
import { render, screen, waitFor } from '../../../lib/testUtils'
import { createRecord } from '../../../models/Record'
import UsageButton from './UsageButton'

it('displays usage when clicked', async () => {
  const date = '2020-02-02'
  const record = createRecord(date, {
    sets: [{ reps: 6 }, { reps: 6 }],
    setType: { field: 'reps', operator: 'exactly', value: 6 },
  })
  const singularRecord = createRecord('2000-02-02', {
    sets: [{ reps: 6 }],
    setType: { field: 'reps', operator: 'exactly', value: 6 },
  })
  vi.mocked(fetchRecords).mockResolvedValue([record, singularRecord])
  const { user } = render(<UsageButton name="name" />)

  // have to wait for server res
  await user.click(await screen.findByLabelText('used in 2 records'))

  // dialog
  expect(screen.getByText(/usage for/i)).toBeVisible()
  expect(screen.getByText(date)).toBeVisible()
  expect(screen.getByText(/2 sets /i)).toBeVisible()
  // singular set (extra trailing space ensures it's not just picking up the
  // start of "sets")
  expect(screen.getByText(/1 set /i)).toBeVisible()

  await user.click(screen.getByText(/close/i))
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

it('shows singular label', async () => {
  const date = '2020-02-02'
  const record = createRecord(date)
  vi.mocked(fetchRecords).mockResolvedValue([record])
  render(<UsageButton name="name" />)

  expect(await screen.findByLabelText('used in 1 record')).toBeVisible()
})
