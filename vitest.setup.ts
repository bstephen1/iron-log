import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { server } from './msw-mocks/server'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  vi,
} from 'vitest'
import 'whatwg-fetch'
import { devUserId } from './lib/frontend/constants'
import { it } from 'node:test'

/* eslint-disable no-var */
// var is required to hoist globals
declare global {
  var jest: typeof vi
  var fit: typeof it.only
  var xit: typeof it.skip
  var fdescribe: typeof describe.only
  var xdescribe: typeof describe.skip
}

globalThis.fit = it.only
globalThis.xit = it.skip
globalThis.fdescribe = describe.only
globalThis.xdescribe = describe.skip

// set env variables with import.meta.env
// note: for ts to recognize this, set compilerOptions: {types: ["vite/client"]} in tsconfig.json
// note: node only supports string vars. See: https://vitest.dev/api/vi.html#vi-stubenv

// typing is from vite/client in tsconfig
import.meta.env.NEXTAUTH_GITHUB_ID = 'my id'
import.meta.env.NEXTAUTH_GITHUB_SECRET = 'secret secret'

// vi.mock will import the actual module and automock all exports.
// If a factory is provided, it replaces the actual module with the factory.

// mongoConnect must be completely replaced since it looks for env vars at the top level
vi.mock('./lib/backend/mongoConnect', () => ({
  clientPromise: vi.fn(),
  db: vi.fn(),
  collections: vi.fn(),
  client: vi.fn(),
}))
vi.mock('./lib/backend/mongoService')
vi.mock('./pages/api/auth/[...nextauth].api', () => ({ authOptions: vi.fn() }))
vi.mock('next-auth', () => ({
  getServerSession: () => ({ user: { id: devUserId } }),
}))

// configure testing-library options
configure({
  // Change default in *byRole queries to omit expensive visibility check.
  // The typical use case will be expect(...).toBeVisible(), so having the *byRole
  // query internally perform a visibility check is redundant.
  defaultHidden: true,
})

beforeAll(() => {
  server.listen()
  // @testing-library/react explicitly hardcodes "jest.advanceTimersByTime" when using fake timers,
  // causing any test using vi.useFakeTimers() to hang indefinitely when using user.click().
  // This workaround reassigns advanceTimersByTime to vitest's version.
  // Note userEvent.setup must also include {advanceTimers: vi.advanceTimersByTime},
  // but this must be done on a per-test basis as it will break any test not using fake timers
  // See: https://github.com/testing-library/react-testing-library/issues/1197
  globalThis.jest = vi
  if (process.env.MSW_LOG_ALL_REQUESTS) {
    server.events.on('request:start', ({ request }) => {
      console.log('MSW:', request.method, request.url)
    })
  }
})
beforeEach(() => server.resetHandlers())
// RTL cleanup is only automatically called if vitest has globals on.
// Without this, the DOM will leak between tests.
afterEach(() => cleanup())
afterAll(() => server.close())
