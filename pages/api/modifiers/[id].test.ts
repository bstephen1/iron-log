import { vi } from 'vitest'
import {
  deleteModifier,
  fetchModifier,
  updateModifierFields,
} from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMalformedBody,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import handler from './[id].api'
import { createModifier } from '../../../models/AsyncSelectorOption/Modifier'
import { generateId } from '../../../lib/util'

export const data = createModifier('hi', 5)
const params = { id: generateId() }

it('fetches given modifier', async () => {
  vi.mocked(fetchModifier).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('updates given modifier', async () => {
  vi.mocked(updateModifierFields).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PATCH' })
})

it('deletes given modifier', async () => {
  vi.mocked(deleteModifier).mockResolvedValue(data._id)

  await expectApiRespondsWithData({
    data: data._id,
    handler,
    params,
    method: 'DELETE',
  })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('guards against invalid fields', async () => {
  await expectApiErrorsOnMalformedBody({
    handler,
    params,
    method: 'PATCH',
    data: { status: 'invalid' },
  })
})

it('requires an id', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
