import { vi } from 'vitest'
import {
  addModifier,
  fetchModifier,
  updateModifierFields,
} from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import handler from './[name].api'
import { createModifier } from '../../../models/AsyncSelectorOption/Modifier'

const data = createModifier('hi', 5)
const params = { name: 'name' }

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

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires a name', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
