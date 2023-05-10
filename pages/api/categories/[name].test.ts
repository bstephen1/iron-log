import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Category from 'models/Category'
import handler from './[name].api'

var mockFetch: vi.mock
var mockAdd: vi.mock
var mockUpdate: vi.mock

vi.mock('lib/backend/mongoService', () => ({
  fetchCategory: (mockFetch = vi.fn()),
  addCategory: (mockAdd = vi.fn()),
  updateCategoryFields: (mockUpdate = vi.fn()),
}))

const data = new Category('hi')
const params = { name: 'name' }

it('fetches given category', async () => {
  mockFetch.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('adds given category', async () => {
  mockAdd.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'POST' })
})

it('updates given category', async () => {
  mockUpdate.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PATCH' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires a name', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
