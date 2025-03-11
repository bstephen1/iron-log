import { vi } from 'vitest'
import { fetchRecords } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import handler from './index.api'
import { createRecord } from '../../../models/Record'

it('fetches records', async () => {
  const data = [createRecord('2000-01-01')]
  vi.mocked(fetchRecords).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
