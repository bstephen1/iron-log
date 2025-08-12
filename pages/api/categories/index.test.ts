import { vi, it } from 'vitest'
import { addCategory, fetchCategories } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMalformedBody,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import { createCategory } from '../../../models/AsyncSelectorOption/Category'
import handler from '.'

it('fetches categories', async () => {
  const data = [createCategory('hi')]
  vi.mocked(fetchCategories).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('adds category', async () => {
  const data = createCategory('hi')
  vi.mocked(addCategory).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, method: 'POST' })
})

it('guards against missing required fields', async () => {
  await expectApiErrorsOnMalformedBody({
    handler,
    data: { missing: 'name' },
  })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
