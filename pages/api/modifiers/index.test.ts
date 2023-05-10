import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Modifier from 'models/Modifier'
import { Status } from 'models/Status'
import handler from './index.api'

// vi.mock is hoisted to the top of the file, but const mockfn = vi.fn()
// is NOT (despite jest docs saying variables starting with "mock" are hoisted).
// What jest really does is ignore the error in vi.mock for accessing mockfn
// before it's defined. ts-jest does not ignore the error, so it breaks.
//
// A workaround is to declare "var mockfn" and define mockfn in vi.mock.
// This works because declaring as var will hoist the variable to the top.
// See: https://github.com/kulshekhar/ts-jest/issues/3292#issuecomment-1221105233
var mockFetchModifiers: vi.mock
vi.mock('lib/backend/mongoService', () => ({
  fetchModifiers: (mockFetchModifiers = vi.fn()),
}))

it('fetches modifiers', async () => {
  const data = [new Modifier('hi', Status.active, 5)]
  mockFetchModifiers.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
