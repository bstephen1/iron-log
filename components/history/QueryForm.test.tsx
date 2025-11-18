import { useState } from 'react'
import { expect, it } from 'vitest'
import { render, screen } from '../../lib/test/rtl'
import { DEFAULT_RECORD_HISTORY_QUERY } from '../../models/Record'
import QueryForm from './QueryForm'

const TestWrapper = () => {
  const [query, setQuery] = useState(DEFAULT_RECORD_HISTORY_QUERY)
  return <QueryForm query={query} updateQuery={setQuery} />
}

it('updates and resets', async () => {
  const { user } = render(<TestWrapper />)

  // update date range
  await user.click(screen.getByText('No filter'))
  await user.click(screen.getByText('Last 3 months'))
  await user.click(screen.getByText('Update filter'))

  expect(screen.getByText('Update filter')).toBeDisabled()

  // resets to latest query from "updateQuery"
  await user.click(screen.getByText('Last 3 months'))
  await user.click(screen.getByText('Last 6 months'))
  await user.click(screen.getByText('Reset'))

  expect(screen.getByText('Last 3 months')).toBeVisible()
})
