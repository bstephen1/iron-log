import { vi, it } from 'vitest'
import { fetchModifiers } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMalformedBody,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import handler from '.'
import { createModifier } from '../../../models/AsyncSelectorOption/Modifier'

it('fetches modifiers', async () => {
  const data = [createModifier('hi', 5)]
  vi.mocked(fetchModifiers).mockResolvedValue(data)

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
