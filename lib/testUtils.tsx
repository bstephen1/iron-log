import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StatusCodes } from 'http-status-codes'
import { delay, http, HttpResponse } from 'msw'
import { NextApiHandler } from 'next'
import { SessionProvider } from 'next-auth/react'
import {
  NtarhInitPagesRouter,
  testApiHandler,
} from 'next-test-api-route-handler'
import { ApiError } from 'next/dist/server/api-utils'
import { ReactElement, ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { vi } from 'vitest'
import { server } from '../msw-mocks/server'
import { methodNotAllowed } from './backend/apiMiddleware/util'

// This file overwrites @testing-library's render and wraps it with components that
// need to be set up for every test.

// Any frontend component that uses SWR needs to be wrapped in SWRConfig to set the fetcher value.
// Also, resetting provider resets the SWR cache between tests.
// Components that don't use SWR can use the normal render.
// Note: fetch() needs to be polyfilled or it will be undefined (just need to add "import 'whatwg-fetch'" in the test setup file).
// See: https://testing-library.com/docs/react-testing-library/setup/#configuring-jest-with-test-utils
// See: https://mswjs.io/docs/faq#swr
const FrontendLayout = ({ children }: { children: ReactNode }) => (
  <SWRConfig
    value={{
      fetcher: (url: string) => fetch(url).then((r) => r.json()),
      provider: () => new Map(),
    }}
  >
    <SessionProvider session={{ user: { id: '' }, expires: '' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </SessionProvider>
  </SWRConfig>
)

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
  },
) => ({
  user: userEvent.setup(
    options?.useFakeTimers
      ? {
          advanceTimers: vi.advanceTimersByTime,
        }
      : undefined,
  ),
  ...render(ui, { wrapper: FrontendLayout, ...options }),
})

export * from '@testing-library/react'
export { customRender as render }

interface ServerOptions {
  /** Add a delay to simulate server response time. Only use this if needed so test times are minimized. */
  delay?: number
  status?: number
  /** specifies the http method the server will use. Defaults to "all". */
  method?: keyof typeof http
}
/** Specify an endpoint and json data to return from the mock server.
 *  This function will intercept the next request at the given endpoint.
 */
export function useServerOnce(
  url: string,
  json?: any,
  options?: ServerOptions,
) {
  const { status, method = 'all' } = options ?? {}
  server.use(
    http[method](
      url,
      async () => {
        await delay(options?.delay ?? 0)
        return HttpResponse.json(json, { status: status ?? StatusCodes.OK })
      },
      { once: true },
    ),
  )
}

interface TestApiResponseProps<T = any>
  extends Partial<NtarhInitPagesRouter<T>> {
  data?: T
  handler: NextApiHandler<T>
  method?: string
}
export async function expectApiRespondsWithData<T>({
  data,
  handler,
  method = 'GET',
  ...testApiHandlerProps
}: TestApiResponseProps) {
  const hasBody = method === 'PUT' || method === 'PATCH' || method === 'POST'
  const body = hasBody ? JSON.stringify(data) : undefined
  const headers = hasBody ? { 'content-type': 'application/json' } : undefined

  await testApiHandler<T>({
    ...testApiHandlerProps,
    pagesHandler: handler,
    test: async ({ fetch }) => {
      const res = await fetch({ method, body, headers })

      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual(data)
    },
  })
}

export async function expectApiErrorsOnInvalidMethod({
  handler,
  method,
  ...testApiHandlerProps
}: TestApiResponseProps) {
  await testApiHandler<ApiError>({
    ...testApiHandlerProps,
    pagesHandler: handler,
    test: async ({ fetch }) => {
      // must be a supported nextjs method: https://github.com/vercel/next.js/blob/canary/packages/next/src/server/web/http.ts
      // default method is one that is never used in the app
      const res = await fetch({ method: method ?? 'OPTIONS' })

      expect(res.status).toBe(methodNotAllowed.statusCode)
      expect(await res.json()).toBe(methodNotAllowed.message)
    },
  })
}

export async function expectApiErrorsOnMissingParams({
  handler,
  ...testApiHandlerProps
}: TestApiResponseProps) {
  await testApiHandler<ApiError>({
    ...testApiHandlerProps,
    pagesHandler: handler,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    },
  })
}
