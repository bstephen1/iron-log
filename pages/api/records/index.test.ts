import { vi } from 'vitest'
import { fetchRecords } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import Record from '../../../models/Record'
import handler from './index.api'

it('fetches records', async () => {
  const data = [new Record('2000-01-01')]
  vi.mocked(fetchRecords).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
