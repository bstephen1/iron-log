import { loadEnvConfig } from '@next/env'
import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { ObjectId } from 'mongodb'
import { afterEach, beforeAll, describe, it, type Mock, vi } from 'vitest'
import { devUserId } from './lib/frontend/constants'

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

// Ensures env vars are loaded using the same load order nextjs uses.
// Vitest does not instantiate the nextjs server so it doesn't automatically
// call loadEnvConfig like dev/prod do.
const projectDir = process.cwd()
loadEnvConfig(projectDir)

// set env variables with import.meta.env
// note: for ts to recognize this, set compilerOptions: {types: ["vite/client"]} in tsconfig.json
// note: node only supports string vars. See: https://vitest.dev/api/vi.html#vi-stubenv

// typing is from vite/client in tsconfig
import.meta.env.NEXTAUTH_GITHUB_ID = 'my id'
import.meta.env.NEXTAUTH_GITHUB_SECRET = 'secret secret'

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
  const actual = await vi.importActual('./lib/backend/mongoService')

  // functions used by useQuery cannot return undefined
  // (automock makes everything return undefined)
  return Object.keys(actual).reduce<Record<string, Mock>>((acc, fn) => {
    // multi fetch functions expect an array, otherwise null *should* be good?
    acc[fn] = vi.fn(() => (fn.endsWith('s') ? [] : null))
    return acc
  }, {})
})
vi.mock('./pages/api/auth/[...nextauth]', () => ({ authOptions: vi.fn() }))
vi.mock('next-auth')
vi.mock('./lib/backend/user', () => ({
  getUserId: vi.fn(async () => new ObjectId(devUserId)),
}))
vi.mock('next/navigation')
vi.mock('react-resize-detector', () => ({
  useResizeDetector: () => ({
    width: undefined,
    height: undefined,
    ref: null,
  }),
}))
vi.mock('swiper/react', async () => {
  const actual = await vi.importActual('swiper/react')

  return {
    ...actual,
    useSwiper: () => ({
      update: vi.fn(),
      slideTo: vi.fn(),
      slidePrev: vi.fn(),
      slides: [],
    }),
  }
})
vi.mock('nuqs', () => ({
  useQueryState: vi.fn(() => [null, vi.fn()]),
}))

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
  // Swiper uses a deprecated "addListener" method that is not available in jsdom,
  // so we must manually stub it out.
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

// RTL cleanup is only automatically called if vitest has globals on.
// Without this, the DOM will leak between tests.
afterEach(() => cleanup())
