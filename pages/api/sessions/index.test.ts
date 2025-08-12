import { it, vi } from 'vitest'
import { fetchSessionLogs } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import { createSessionLog } from '../../../models/SessionLog'
import handler from './index'

it('fetches sessions', async () => {
  const data = [createSessionLog('2000-01-01')]
  vi.mocked(fetchSessionLogs).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
