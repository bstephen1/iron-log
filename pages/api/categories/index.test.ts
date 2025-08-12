import { it, vi } from 'vitest'
import handler from '.'
import { fetchCategories } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMalformedBody,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import { createCategory } from '../../../models/AsyncSelectorOption/Category'

it('fetches categories', async () => {
  const data = [createCategory('hi')]
  vi.mocked(fetchCategories).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
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
