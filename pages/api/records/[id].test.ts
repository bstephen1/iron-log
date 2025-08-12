import { fetchRecord } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import { generateId } from '../../../lib/util'
import handler from './[id]'
import { createRecord } from '../../../models/Record'
import { vi, it } from 'vitest'

export const data = createRecord('2000-01-01')
const id = generateId()
const params = { id }

it('fetches given record', async () => {
  vi.mocked(fetchRecord).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires an id', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
