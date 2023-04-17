import { StatusCodes } from 'http-status-codes'
import { generateId } from 'lib/util'
import Record from 'models/Record'
import { testApiHandler } from 'next-test-api-route-handler'
import IdApi from './[id].api'

var mockFetch: jest.Mock
var mockAdd: jest.Mock
var mockUpdate: jest.Mock
var mockUpdateFields: jest.Mock

jest.mock('lib/backend/mongoService', () => ({
  fetchRecord: (mockFetch = jest.fn()),
  addRecord: (mockAdd = jest.fn()),
  updateRecord: (mockUpdate = jest.fn()),
  updateRecordFields: (mockUpdateFields = jest.fn()),
}))

const data = new Record('2000-01-01')
const id = generateId()

it('fetches given record', async () => {
  mockFetch.mockReturnValue(data)

  await testApiHandler<Record>({
    handler: IdApi,
    params: { id },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual(data)
    },
  })
})

it('adds given record', async () => {
  mockAdd.mockReturnValue(data)

  await testApiHandler({
    handler: IdApi,
    params: { id },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' },
      })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual(data)
      expect(mockAdd).toHaveBeenCalledTimes(1)
    },
  })
})

it('updates given record fields', async () => {
  mockUpdateFields.mockReturnValue(data)

  await testApiHandler({
    handler: IdApi,
    params: { id },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' },
      })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual(data)
      expect(mockUpdateFields).toHaveBeenCalledTimes(1)
    },
  })
})

it('updates given record', async () => {
  mockUpdate.mockReturnValue(data)

  await testApiHandler({
    handler: IdApi,
    params: { id },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' },
      })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual(data)
      expect(mockUpdate).toHaveBeenCalledTimes(1)
    },
  })
})

it('blocks invalid method types', async () => {
  await testApiHandler({
    handler: IdApi,
    params: { id },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'TRACE' })
      expect(res.status).toBe(StatusCodes.METHOD_NOT_ALLOWED)
      expect(await res.json()).toMatch(/not allowed/i)
    },
  })
})

it('requires an id', async () => {
  await testApiHandler({
    handler: IdApi,
    // omit the id param
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(await res.json()).toMatch(/id/i)
    },
  })
})
