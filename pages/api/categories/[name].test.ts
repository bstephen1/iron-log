import { vi } from 'vitest'
import {
  addCategory,
  fetchCategory,
  updateCategoryFields,
} from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import { createCategory } from '../../../models/AsyncSelectorOption/Category'
import handler from './[name].api'

const data = createCategory('hi')
const params = { name: 'name' }

it('fetches given category', async () => {
  vi.mocked(fetchCategory).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('adds given category', async () => {
  vi.mocked(addCategory).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'POST' })
})

it('updates given category', async () => {
  vi.mocked(updateCategoryFields).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PATCH' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires a name', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
