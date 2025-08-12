import { it, vi } from 'vitest'
import { fetchSessionLog } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'

import { createSessionLog } from '../../../models/SessionLog'
import handler from './[date]'

const date = '2000-01-01'
const data = createSessionLog(date)
const params = { date }

it('fetches given session', async () => {
  vi.mocked(fetchSessionLog).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires a date', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
