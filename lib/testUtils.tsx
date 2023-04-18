import { render, RenderOptions } from '@testing-library/react'
import { StatusCodes } from 'http-status-codes'
import { rest } from 'msw'
import { server } from 'msw-mocks/server'
import { NextApiHandler } from 'next'
import { NtarhParameters, testApiHandler } from 'next-test-api-route-handler'
import { ApiError } from 'next/dist/server/api-utils'
import { ReactElement, ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { methodNotAllowed } from './backend/apiMiddleware/util'

// This file overwrites @testing-library's render and wraps it with components that
// need to be set up for every test.

// Any frontend component that uses SWR needs to be wrapped in SWRConfig to set the fetcher value.
// Also, resetting provider resets the SWR cache between tests.
// Components that don't use SWR can use the normal render.
// Note: fetch() needs to be polyfilled or it will be undefined (just need to add "import 'whatwg-fetch'").
// This should be setup already in jest's setup file.
// See: https://testing-library.com/docs/react-testing-library/setup/#configuring-jest-with-test-utils
// See: https://mswjs.io/docs/faq#swr
const FrontendLayout = ({ children }: { children: ReactNode }) => (
  <SWRConfig
    value={{
      fetcher: (url: string) => fetch(url).then((r) => r.json()),
      provider: () => new Map(),
    }}
  >
    {children}
  </SWRConfig>
)

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: FrontendLayout, ...options })

export * from '@testing-library/react'
export { customRender as render }

interface ServerOptions {
  /** Add a delay to simulate server response time. Only use this if needed so test times are minimized. */
  delay?: number
  status?: number
}
/** Specify an endpoint and json data to return from the mock server.
 *  This function will intercept the next request at the given endpoint
 *  over any http method.
 */
export function useServerOnce(
  url: string,
  json?: any,
  options?: ServerOptions
) {
  const { status, delay } = options ?? {}
  server.use(
    rest.all(url, (_, res, ctx) =>
      res.once(
        ctx.status(status ?? StatusCodes.OK),
        ctx.json(json ?? {}),
        ctx.delay(delay ?? 0)
      )
    )
  )
}

interface TestApiResponseProps<T = any> extends Partial<NtarhParameters<T>> {
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
  const headers = hasBody ? { 'content-type': 'application/json' } : {}

  await testApiHandler<T>({
    ...testApiHandlerProps,
    handler,
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
    handler,
    test: async ({ fetch }) => {
      const res = await fetch({ method: method ?? 'TRACE' })

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
    handler,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })

      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    },
  })
}
