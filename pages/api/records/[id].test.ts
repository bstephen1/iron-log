import { vi } from 'vitest'
import {
  deleteRecord,
  fetchRecord,
  updateRecord,
  updateRecordFields,
} from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import { generateId } from '../../../lib/util'
import handler from './[id].api'
import { createRecord } from '../../../models/Record'

export const data = createRecord('2000-01-01')
const id = generateId()
const params = { id }

it('fetches given record', async () => {
  vi.mocked(fetchRecord).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('updates given record fields', async () => {
  vi.mocked(updateRecordFields).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PATCH' })
})

it('updates given record', async () => {
  vi.mocked(updateRecord).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PUT' })
})

it('deletes given record', async () => {
  vi.mocked(deleteRecord).mockResolvedValue('id')

  await expectApiRespondsWithData({
    data: 'id',
    handler,
    params,
    method: 'DELETE',
  })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires an id', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
