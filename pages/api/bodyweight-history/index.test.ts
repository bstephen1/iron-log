import { vi } from 'vitest'
import {
  addBodyweight,
  fetchBodyweightHistory,
  updateBodyweight,
} from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
  expectApiErrorsOnMalformedBody,
} from '../../../lib/testUtils'
import handler from './index.api'
import { createBodyweight } from '../../../models/Bodyweight'

const data = createBodyweight(50, 'official')

it('fetches given bodyweight', async () => {
  vi.mocked(fetchBodyweightHistory).mockResolvedValue([data])

  await expectApiRespondsWithData({ data: [data], handler })
})

it('adds given bodyweight', async () => {
  vi.mocked(addBodyweight).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, method: 'POST' })
})

it('updates given bodyweight', async () => {
  vi.mocked(updateBodyweight).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, method: 'PUT' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})

it('guards against missing fields', async () => {
  await expectApiErrorsOnMalformedBody({
    handler,
    data: { weight: 50 },
  })
})

it('guards against invalid fields', async () => {
  await expectApiErrorsOnMalformedBody({
    handler,
    method: 'PUT',
    data: { ...data, type: 'invalid' },
  })
})
