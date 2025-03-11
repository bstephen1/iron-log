import { vi } from 'vitest'
import { fetchModifiers } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import handler from './index.api'
import { createModifier } from '../../../models/AsyncSelectorOption/Modifier'

it('fetches modifiers', async () => {
  const data = [createModifier('hi', 5)]
  vi.mocked(fetchModifiers).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
