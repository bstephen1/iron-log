import { vi } from 'vitest'
import {
  addSession,
  fetchSession,
  updateSession,
} from '../../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from '../../../../lib/testUtils'

import handler from './index.api'
import { createSessionLog } from '../../../../models/SessionLog'

const date = '2000-01-01'
const data = createSessionLog(date)
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
