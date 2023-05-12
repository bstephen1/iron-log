import {
  addCategory,
  fetchCategory,
  updateCategoryFields,
} from 'lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Category from 'models/Category'
import { vi } from 'vitest'
import handler from './[name].api'

const data = new Category('hi')
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
