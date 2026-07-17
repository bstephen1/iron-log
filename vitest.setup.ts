import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach, beforeAll, describe, it, type Mock, vi } from 'vitest'

// NOTE: This setup is run before every test file.
// It should avoid heavy operations that would be expensive to execute many times.

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

// vi.mock will import the actual module and automock all exports to return undefined.
// If a factory is provided, it replaces the actual module with the factory.

// mongoConnect must be completely replaced since it looks for env vars at the top level
vi.mock('./lib/backend/mongoConnect', () => ({
  clientPromise: '',
  // Do not need to mock mongoCollections, just stub out the db.collection call,
  // which is automatically invoked in the imports of mongoService (since it does importActual)
  db: { collection: () => {} },
  client: '',
}))
vi.mock('./lib/backend/mongoService', async () => {
  // importActual means every test will transitively import everything mongoService imports
  const actual = await vi.importActual('./lib/backend/mongoService')

  // functions used by useQuery cannot return undefined
  // (automock makes everything return undefined)
  return Object.keys(actual).reduce<Record<string, Mock>>((acc, fn) => {
    // multi fetch functions expect an array, otherwise null *should* be good?
    acc[fn] = vi.fn(() => (fn.endsWith('s') ? [] : null))
    return acc
  }, {})
})
vi.mock('next/navigation')

// configure testing-library options
configure({
  // Change default in *byRole queries to omit expensive visibility check.
  // The typical use case will be expect(...).toBeVisible(), so having the *byRole
  // query internally perform a visibility check is redundant.
  defaultHidden: true,
})

beforeAll(() => {
  // @testing-library/react explicitly hardcodes "jest.advanceTimersByTime" when using fake timers,
  // causing any test using vi.useFakeTimers() to hang indefinitely when using user.click().
  // This workaround reassigns advanceTimersByTime to vitest's version.
  // Note userEvent.setup must also include {advanceTimers: vi.advanceTimersByTime},
  // but this must be done on a per-test basis as it will break any test not using fake timers
  // See: https://github.com/testing-library/react-testing-library/issues/1197
  globalThis.jest = vi
})

// RTL cleanup is only automatically called if vitest has globals on.
// Without this, the DOM will leak between tests.
afterEach(() => cleanup())
