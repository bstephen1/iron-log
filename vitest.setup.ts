import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'
import { vi } from 'vitest'
import 'whatwg-fetch'
import { server } from './msw-mocks/server'

// set env variables with import.meta.env
// note: for ts to recognize this, set compilerOptions: {types: ["vite/client"]} in tsconfig.json
// note: node only supports string vars. See: https://vitest.dev/api/vi.html#vi-stubenv

// increase limit for printing dom on failed expect(). Default is 7000 and usually cuts off too soon.
import.meta.env.DEBUG_PRINT_LIMIT = '50000'

// vi.mock will import the actual module and automock all exports.
// If a factory is provided, it replaces the actual module with the factory.
vi.mock('lib/backend/mongoConnect', () => ({
  db: { collection: vi.fn() },
  clientPromise: vi.fn(),
}))
vi.mock('lib/backend/mongoService')
vi.mock('pages/api/auth/[...nextauth].api', () => ({ authOptions: vi.fn() }))
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
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
