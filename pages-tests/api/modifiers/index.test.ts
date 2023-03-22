import Modifier from 'models/Modifier'
import { Status } from 'models/Status'
import { testApiHandler } from 'next-test-api-route-handler'
import modifiers from 'pages/api/modifiers'

// This took forever to debug the mysterious "jest unexpected parsing" error.
// The problem stems from requireActual() when mocking util. Even though we are
// mocking getUserId(), requireActual pulls the real one before mocking it,
// and then it freaks out about getServerSession and authOptions.
//
// So basically we are going down another level and no longer need to
// mock getUserId(), but rather the functions it is calling.
//
// However, this is not ideal because there seems to be no way to share these
// mocks among other test files. The mocks get hoisted so they come before
// any imports. Jest has a __mocks__ folder but you have to place it at the
// same level as the module being mocked for some reason, so that is incompatible
// with anything in pages because files in pages are treated as URL endpoints.
jest
  .mock('pages/api/auth/[...nextauth]', () => ({
    authOptions: { providers: [] },
  }))
  .mock('next-auth', () => ({
    getServerSession: () => ({ user: { id: '1234567890AB' } }),
  }))

// jest.mock is hoisted to the top of the file, but const mockfn = jest.fn()
// is NOT (despite jest docs saying variables starting with "mock" are hoisted).
// What jest really does is ignore the error in jest.mock for accessing mockfn
// before it's defined. ts-jest does not ignore the error, so it breaks.
//
// A workaround is to declare "var mockfn" and define mockfn in jest.mock.
// This works because declaring as var will hoist the variable to the top.
// See: https://github.com/kulshekhar/ts-jest/issues/3292#issuecomment-1221105233
var mockFetchModifiers: jest.Mock
jest.mock('lib/backend/mongoService', () => ({
  fetchModifiers: (mockFetchModifiers = jest.fn()),
}))

// jest.mock('lib/backend/apiMiddleware/util', () => {
//   const actual = jest.requireActual('lib/backend/apiMiddleware/util')

//   return ({
//     ...jest.requireActual('lib/backend/apiMiddleware/util'),
//     getUserId: jest.fn()
//   })
// })

it('fetches modifiers', async () => {
  const data = [new Modifier('hi', Status.active, 5)]
  mockFetchModifiers.mockReturnValue(data)
  await testApiHandler<Modifier[]>({
    handler: modifiers,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      await expect(res.json()).resolves.toEqual(data)
    },
  })
})

it('blocks invalid method types', async () => {
  const data = [new Modifier('hi', Status.active, 5)]
  mockFetchModifiers.mockReturnValue(data)
  await testApiHandler<Modifier[]>({
    handler: modifiers,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(await res.json()).toBe('Method not allowed.')
    },
  })
})
