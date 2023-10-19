import { fetchCategories } from 'lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Category from 'models/AsyncSelectorOption/Category'
import { vi } from 'vitest'
import handler from './index.api'

it('fetches categories', async () => {
  const data = [new Category('hi')]
  vi.mocked(fetchCategories).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
