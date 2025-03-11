import { vi } from 'vitest'
import { fetchRecords } from '../../../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../../../lib/testUtils'

import handler from './index.api'
import { createRecord } from '../../../../../models/Record'

const date = '2000-01-01'
const params = { date }

it('fetches records', async () => {
  const data = [createRecord(date)]
  vi.mocked(fetchRecords).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})
