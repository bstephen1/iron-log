import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Bodyweight from 'models/Bodyweight'
import handler from './index.api'

var mockFetch: jest.Mock
var mockAdd: jest.Mock
var mockUpdate: jest.Mock

jest.mock('lib/backend/mongoService', () => ({
  fetchBodyweightHistory: (mockFetch = jest.fn()),
  addBodyweight: (mockAdd = jest.fn()),
  updateBodyweight: (mockUpdate = jest.fn()),
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
