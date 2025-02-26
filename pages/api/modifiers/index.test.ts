import { vi } from 'vitest'
import { fetchModifiers } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import Modifier from '../../../models/AsyncSelectorOption/Modifier'
import handler from './index.api'

it('fetches modifiers', async () => {
  const data = [new Modifier('hi', 5)]
  vi.mocked(fetchModifiers).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
