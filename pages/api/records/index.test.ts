import { addRecord, fetchRecords } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import handler from './index.api'
import { createRecord } from '../../../models/Record'
import { vi, it } from 'vitest'

it('fetches records', async () => {
  const data = [createRecord('2000-01-01')]
  vi.mocked(fetchRecords).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('adds record', async () => {
  const data = createRecord('2000-01-01')
  vi.mocked(addRecord).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, method: 'POST' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
