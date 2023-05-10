import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Category from 'models/Category'
import handler from './index.api'

var mockFetch: vi.mock
vi.mock('lib/backend/mongoService', () => ({
  fetchCategories: (mockFetch = vi.fn()),
}))

it('fetches categories', async () => {
  const data = [new Category('hi')]
  mockFetch.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
