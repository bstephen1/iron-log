import { vi } from 'vitest'
import {
  addCategory,
  deleteCategory,
  fetchCategory,
  updateCategoryFields,
} from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
  expectApiErrorsOnMalformedBody,
} from '../../../lib/testUtils'
import { createCategory } from '../../../models/AsyncSelectorOption/Category'
import handler from './[id].api'
import { generateId } from '../../../lib/util'

const data = createCategory('hi')
const params = { id: generateId() }

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

it('deletes given category', async () => {
  vi.mocked(deleteCategory).mockResolvedValue(data._id)

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

it('requires an id', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})

it('guards against missing fields', async () => {
  await expectApiErrorsOnMalformedBody({
    handler,
    params,
    data: { name: 'hi' },
  })
})

it('guards against extra fields', async () => {
  await expectApiErrorsOnMalformedBody({
    handler,
    params,
    data: { ...data, extra: 'field' },
  })
})

it('guards against invalid fields', async () => {
  await expectApiErrorsOnMalformedBody({
    handler,
    params,
    method: 'PATCH',
    data: { status: 'invalid' },
  })
})
