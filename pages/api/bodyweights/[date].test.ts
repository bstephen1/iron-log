import { vi, it } from 'vitest'
import { updateBodyweight } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMalformedBody,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import { createBodyweight } from '../../../models/Bodyweight'
import handler from './[date].api'

const data = createBodyweight(50, 'official')
const params = { date: data.date }

it('updates given bodyweight', async () => {
  vi.mocked(updateBodyweight).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PUT' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('guards against missing required fields', async () => {
  await expectApiErrorsOnMalformedBody({
    handler,
    method: 'PUT',
    params,
    data: { missing: 'type, value' },
  })
})

it('guards against invalid fields', async () => {
  await expectApiErrorsOnMalformedBody({
    handler,
    method: 'PUT',
    params,
    data: { ...data, type: 'invalid' },
  })
})
