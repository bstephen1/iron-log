import { vi } from 'vitest'
import {
  fetchSession,
  addSession,
  updateSession,
} from '../../../../lib/backend/mongoService'
import {
  expectApiRespondsWithData,
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
} from '../../../../lib/testUtils'
import SessionLog from '../../../../models/SessionLog'

import handler from './index.api'

const date = '2000-01-01'
const data = new SessionLog(date)
const params = { date }

it('fetches given session', async () => {
  vi.mocked(fetchSession).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('adds given session', async () => {
  vi.mocked(addSession).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'POST' })
})

it('updates given session', async () => {
  vi.mocked(updateSession).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PUT' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires a date', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
