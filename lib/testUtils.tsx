import { render, RenderOptions } from '@testing-library/react'
import { StatusCodes } from 'http-status-codes'
import { server } from 'mocks/server'
import { rest } from 'msw'
import React, { ReactElement } from 'react'
import { SWRConfig } from 'swr'

// This file overwrites @testing-library's render and wraps it with components that
// need to be set up for every test.

// Any frontend component that uses SWR needs to be wrapped in SWRConfig to set the fetcher value.
// Also, resetting provider resets the SWR cache between tests.
// Components that don't use SWR can use the normal render.
// Note: fetch() needs to be polyfilled or it will be undefined (just need to add "import 'whatwg-fetch'").
// This should be setup already in jest's setup file.
// See: https://testing-library.com/docs/react-testing-library/setup/#configuring-jest-with-test-utils
// See: https://mswjs.io/docs/faq#swr
const FrontendLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((r) => r.json()),
        provider: () => new Map(),
      }}
    >
      {children}
    </SWRConfig>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: FrontendLayout, ...options })

export * from '@testing-library/react'
export { customRender as render }

export function useServerGet(url: string, json: any = {}) {
  server.use(
    rest.get(url, (_, res, ctx) =>
      res(ctx.status(StatusCodes.OK), ctx.json(json))
    )
  )
}
