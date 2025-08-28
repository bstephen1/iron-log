import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type Session } from 'next-auth'
import { Suspense, type ReactElement } from 'react'
import { vi } from 'vitest'
import Layout from '../components/Layout'
import { devUserId } from './frontend/constants'

// This file overwrites @testing-library's render and wraps it with components that
// need to be set up for every test.

/** Custom render implementation that wraps the element with necessary layout components (eg, SWRConfig).
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
                swrConfig: {
                  // Note: fetch() needs to be polyfilled or it will be undefined (just need to add "import 'whatwg-fetch'" in the test setup file).
                  // See: https://testing-library.com/docs/react-testing-library/setup/#configuring-jest-with-test-utils
                  // See: https://mswjs.io/docs/faq#swr
                  fetcher: (url: string) => fetch(url).then((r) => r.json()),
                  provider: () => new Map(),
                },
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
