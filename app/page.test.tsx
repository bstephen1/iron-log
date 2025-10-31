import { getServerSession } from 'next-auth'
import { expect, it, vi } from 'vitest'
import { guestUserName } from '../lib/frontend/constants'
import { render, screen } from '../lib/test/rtl'
import Home from './page'

it('renders as non-guest user', async () => {
  // The page is an async server component, so it must be awaited in the render
  // params can be added if applicable, eg await Home({params: {...}})
  render(await Home())

  expect(screen.getByText(`Today's log`)).toBeVisible()
})

it('renders as guest user', async () => {
  vi.mocked(getServerSession).mockResolvedValue({
    user: { name: guestUserName },
  })
  render(await Home())

  expect(screen.getByText(/guest/)).toBeVisible()
})
