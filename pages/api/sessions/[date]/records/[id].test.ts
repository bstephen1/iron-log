import { vi } from 'vitest'
import {
  deleteSessionRecord,
  fetchRecord,
} from '../../../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from '../../../../../lib/testUtils'
import { generateId } from '../../../../../lib/util'
import { createRecord } from '../../../../../models/Record'
import handler from './[id].api'
import { createSessionLog } from '../../../../../models/SessionLog'

const date = '2000-01-01'
const record = createRecord(date)
const session = createSessionLog(date)
const id = generateId()
const params = { id, date }

it('fetches given record', async () => {
  vi.mocked(fetchRecord).mockResolvedValue(record)

  await expectApiRespondsWithData({ data: record, handler, params })
})

it('deletes given record', async () => {
  vi.mocked(deleteSessionRecord).mockResolvedValue(session)

  await expectApiRespondsWithData({
    data: session,
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
