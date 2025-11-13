import { getServerSession } from 'next-auth'
import { expect, it, vi } from 'vitest'
import { devUserId, guestUserName } from '../lib/frontend/constants'
import { baseRender, render, screen } from '../lib/test/rtl'
import RootLayout from './layout'
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

it('renders with full root layout', async () => {
  vi.mocked(getServerSession).mockResolvedValue({
    user: { name: devUserId },
  })
  // mock out SessionProvider fetch to /api/auth/session
  vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify({})))

  baseRender(await RootLayout({ children: await Home() }), {
    // By default, baseRender() wraps the given component in <div>. This is
    // invalid here since the root layout contains a top level <html> tag.
    container: document,
  })

  expect(screen.getByText('Iron Log')).toBeVisible()
})
