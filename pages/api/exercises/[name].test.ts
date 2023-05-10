import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Exercise from 'models/Exercise'
import handler from './[name].api'

var mockFetch: vi.mock
var mockAdd: vi.mock
var mockUpdate: vi.mock
var mockUpdateFields: vi.mock

vi.mock('lib/backend/mongoService', () => ({
  fetchExercise: (mockFetch = vi.fn()),
  addExercise: (mockAdd = vi.fn()),
  updateExercise: (mockUpdate = vi.fn()),
  updateExerciseFields: (mockUpdateFields = vi.fn()),
}))

const data = new Exercise('hi')
const params = { name: 'name' }

it('fetches given exercise', async () => {
  mockFetch.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('adds given exercise', async () => {
  mockAdd.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'POST' })
})

it('updates given exercise fields', async () => {
  mockUpdateFields.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PATCH' })
})

it('updates given exercise', async () => {
  mockUpdate.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PUT' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires a name', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
