import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Modifier from 'models/Modifier'
import { Status } from 'models/Status'
import handler from './[name].api'

var mockFetch: vi.mock
var mockAdd: vi.mock
var mockUpdate: vi.mock

vi.mock('lib/backend/mongoService', () => ({
  fetchModifier: (mockFetch = vi.fn()),
  addModifier: (mockAdd = vi.fn()),
  updateModifierFields: (mockUpdate = vi.fn()),
}))

const data = new Modifier('hi', Status.active, 5)
const params = { name: 'name' }

it('fetches given modifier', async () => {
  mockFetch.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('adds given modifier', async () => {
  mockAdd.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'POST' })
})

it('updates given modifier', async () => {
  mockUpdate.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PATCH' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires a name', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
