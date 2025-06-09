import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { server } from './msw-mocks/server'
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest'
import 'whatwg-fetch'
import { devUserId } from './lib/frontend/constants'

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

// msw server
beforeAll(() => {
  server.listen()
  // @testing-library/react explicitly hardcodes "jest.advanceTimersByTime" when using fake timers,
  // causing any test using vi.useFakeTimers() to hang indefinitely when using user.click().
  // This workaround reassigns advanceTimersByTime to vitest's version.
  // Note userEvent.setup must also include {advanceTimers: vi.advanceTimersByTime},
  // but this must be done on a per-test basis as it will break any test not using fake timers
  // See: https://github.com/testing-library/react-testing-library/issues/1197
  // @ts-expect-error ts can't see the type of globalThis
  globalThis.jest = vi
})
beforeEach(() => server.resetHandlers())
// RTL cleanup is only automatically called if vitest has globals on.
// Without this, the DOM will leak between tests.
afterEach(() => cleanup())
afterAll(() => server.close())
