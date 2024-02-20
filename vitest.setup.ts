import '@testing-library/jest-dom/vitest'
import { configure } from '@testing-library/react'
import { server } from './msw-mocks/server'
import { vi } from 'vitest'
import 'whatwg-fetch'

// set env variables with import.meta.env
// note: for ts to recognize this, set compilerOptions: {types: ["vite/client"]} in tsconfig.json
// note: node only supports string vars. See: https://vitest.dev/api/vi.html#vi-stubenv

// increase limit for printing dom on failed expect(). Default is 7000 and usually cuts off too soon.
// typing is from vite/client in tsconfig
import.meta.env.DEBUG_PRINT_LIMIT = '50000'
// import.meta.env.COLORS = false

// vi.mock will import the actual module and automock all exports.
// If a factory is provided, it replaces the actual module with the factory.
vi.mock('./lib/backend/mongoConnect', () => ({
  getDb: () => ({
    collections: vi.fn(),
  }),
  getCollections: () => vi.fn(),
}))
vi.mock('./lib/backend/mongoService')
vi.mock('./pages/api/auth/[...nextauth].api', () => ({ authOptions: vi.fn() }))
vi.mock('next-auth', () => ({
  getServerSession: () => ({ user: { id: '1234567890AB' } }),
}))

// configure testing-library options
configure({
  // Change default in *byRole queries to omit expensive visibility check.
  // The typical use case will be expect(...).toBeVisible(), so having the *byRole
  // query internally perform a visibility check is redundant.
  defaultHidden: true,
})

// msw server
beforeAll(() => {
  server.listen({
    onUnhandledRequest(req, print) {
      // testApiHandler for api routes prompts an msw interception of the form "http://localhost:61913/"
      // where the port number is a random 5 digit number.
      // This suppresses the "unhandled msw interception" warning
      if (req.url.match(/http:\/\/localhost:[0-9]{5}\//)) return

      print.warning()
    },
  })
  // @testing-library/react explicitly hardcodes "jest.advanceTimersByTime" when using fake timers,
  // causing any test using vi.useFakeTimers() to hang indefinitely when using user.click().
  // This workaround reassigns advanceTimersByTime to vitest's version.
  // Note userEvent.setup must also include {advanceTimers: vi.advanceTimersByTime},
  // but this must be done on a per-test basis as it will break any test not using fake timers
  // See: https://github.com/testing-library/react-testing-library/issues/1197
  ;((globalThis as any).jest as Record<string, unknown>) = {
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
  }
})
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())
