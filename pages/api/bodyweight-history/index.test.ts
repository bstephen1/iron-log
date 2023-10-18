import {
  addBodyweight,
  fetchBodyweightHistory,
  updateBodyweight,
} from 'lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Bodyweight from 'models/Bodyweight'
import { it, vi } from 'vitest'
import handler from './index.api'

const data = new Bodyweight(50, 'official')

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
