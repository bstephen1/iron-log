import Modifier from 'models/Modifier'
import { Status } from 'models/Status'
import { testApiHandler } from 'next-test-api-route-handler'
import modifiers from 'pages/api/modifiers'

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

// can add a __mocks__ folder for this, but still need to call jest.mock every test...
// jest.mock('lib/backend/mongoConnect', () => jest.fn())

// so, I think we could just mock this?
jest.mock('pages/api/auth/[...nextauth]', () => jest.fn())

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
  await testApiHandler<Modifier[]>({
    handler: modifiers,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(await res.json()).toBe('Method not allowed.')
    },
  })
})
