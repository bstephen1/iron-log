import { it, vi } from 'vitest'
import handler from '.'
import { fetchCategories } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import { createCategory } from '../../../models/AsyncSelectorOption/Category'

it('fetches categories', async () => {
  const data = [createCategory('hi')]
  vi.mocked(fetchCategories).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
