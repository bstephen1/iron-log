import { vi } from 'vitest'
import { fetchSessions } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import handler from './index.api'
import { createSessionLog } from '../../../models/SessionLog'

it('fetches sessions', async () => {
  const data = [createSessionLog('2000-01-01')]
  vi.mocked(fetchSessions).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
