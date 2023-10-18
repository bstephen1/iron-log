import {
  addRecord,
  fetchRecord,
  updateRecord,
  updateRecordFields,
} from 'lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import { generateId } from 'lib/util'
import Record from 'models/Record'
import { it, vi } from 'vitest'
import handler from './[id].api'

const data = new Record('2000-01-01')
const id = generateId()
const params = { id }

it('fetches given record', async () => {
  vi.mocked(fetchRecord).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('adds given record', async () => {
  vi.mocked(addRecord).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'POST' })
})

it('updates given record fields', async () => {
  vi.mocked(updateRecordFields).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PATCH' })
})

it('updates given record', async () => {
  vi.mocked(updateRecord).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PUT' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires an id', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
