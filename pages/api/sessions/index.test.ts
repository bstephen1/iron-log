import { vi } from 'vitest'
import { fetchSessions } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import SessionLog from '../../../models/SessionLog'
import handler from './index.api'

it('fetches sessions', async () => {
  const data = [new SessionLog('2000-01-01')]
  vi.mocked(fetchSessions).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
