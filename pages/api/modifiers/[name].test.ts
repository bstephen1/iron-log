import {
  addModifier,
  fetchModifier,
  updateModifierFields,
} from 'lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Modifier from 'models/AsyncSelectorOption/Modifier'
import { Status } from 'models/Status'
import { vi } from 'vitest'
import handler from './[name].api'

const data = new Modifier('hi', Status.active, 5)
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
