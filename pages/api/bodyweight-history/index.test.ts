import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Bodyweight from 'models/Bodyweight'
import handler from './index.api'

var mockFetch: vi.mock
var mockAdd: vi.mock
var mockUpdate: vi.mock

vi.mock('lib/backend/mongoService', () => ({
  fetchBodyweightHistory: (mockFetch = vi.fn()),
  addBodyweight: (mockAdd = vi.fn()),
  updateBodyweight: (mockUpdate = vi.fn()),
}))

const data = new Bodyweight(50, 'official')

it('fetches given bodyweight', async () => {
  mockFetch.mockReturnValue([data])

  await expectApiRespondsWithData({ data: [data], handler })
})

it('adds given bodyweight', async () => {
  mockAdd.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, method: 'POST' })
})

it('updates given bodyweight', async () => {
  mockUpdate.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, method: 'PUT' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
