import { vi } from 'vitest'
import {
  addModifier,
  deleteModifier,
  fetchModifier,
  updateModifierFields,
} from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import handler from './[id].api'
import { createModifier } from '../../../models/AsyncSelectorOption/Modifier'
import { generateId } from '../../../lib/util'

const data = createModifier('hi', 5)
const params = { id: generateId() }

it('fetches given modifier', async () => {
  vi.mocked(fetchModifier).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('adds given modifier', async () => {
  vi.mocked(addModifier).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'POST' })
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

it('requires a name', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
