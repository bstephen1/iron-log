import { vi } from 'vitest'
import { fetchRecords } from '../../../../../lib/backend/mongoService'
import {
  expectApiRespondsWithData,
  expectApiErrorsOnInvalidMethod,
} from '../../../../../lib/testUtils'
import Record from '../../../../../models/Record'

import handler from './index.api'

const date = '2000-01-01'
const params = { date }

it('fetches records', async () => {
  const data = [new Record(date)]
  vi.mocked(fetchRecords).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})
