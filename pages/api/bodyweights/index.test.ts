import { vi, it } from 'vitest'
import { fetchBodyweights } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import { createBodyweight } from '../../../models/Bodyweight'
import handler from '.'

const data = createBodyweight(50, 'official')

it('fetches given bodyweight', async () => {
  vi.mocked(fetchBodyweights).mockResolvedValue([data])

  await expectApiRespondsWithData({ data: [data], handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
