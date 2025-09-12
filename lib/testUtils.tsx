import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type RenderOptions, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams } from 'next/navigation'
import type { Session } from 'next-auth'
import { type ReactElement, Suspense } from 'react'
import { vi } from 'vitest'
import Layout from '../components/Layout'
import { devUserId } from './frontend/constants'

// This file overwrites @testing-library's render and wraps it with components that
// need to be set up for every test.

/** Custom render implementation that wraps the element with necessary layout components.
 *  Also returns a user object to remove the need to setup a userEvent.
 */
// This does do an unnecessary setup if there's no interaction, but that's probably not a big deal.
// setup() is supposed to make negligable performance impact and it would probably be more annoying
// juggling two render functions depending on whether user interaction is needed.
// Using setup() is supposed to prevent very rare but very tricky bugs.
// See:
// https://github.com/testing-library/user-event/discussions/1036
// https://github.com/testing-library/user-event/discussions/1052
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    /** this MUST be enabled if using vi.useFakeTimers(). Otherwise the test will hang indefinitely.
     *  It cannot be enabled globally because then any test NOT using fake timers will fail.
     */
    useFakeTimers?: boolean
    user?: Session['user']
    /** provide the url param date. Defaults to 2000-01-01 */
    date?: string
  }
) => ({
  user: userEvent.setup(
    options?.useFakeTimers
      ? {
          advanceTimers: vi.advanceTimersByTime,
        }
      : undefined
  ),
  ...render(ui, {
    wrapper: ({ children }) => {
      // each test must have a new queryClient to ensure isolation
      // (otherwise data will be cached and reused between tests)
      const queryClient = new QueryClient()

      vi.mocked(useParams).mockReturnValue({
        date: options?.date ?? '2000-01-01',
      })

      return (
        <QueryClientProvider client={queryClient}>
          <Suspense
            fallback={
              <div>
                Component is loading due to react-query prefetching. Use a
                screen.findByXXX query.
              </div>
            }
          >
            <Layout
              {...{
                disableNavbar: true,
                session: {
                  user: options?.user ?? { id: devUserId },
                  expires: '',
                },
              }}
            >
              {children}
            </Layout>
          </Suspense>
        </QueryClientProvider>
      )
    },
    ...options,
  }),
})

export * from '@testing-library/react'
export { customRender as render }
