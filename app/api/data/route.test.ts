import { NextRequest } from 'next/server'
import { expect, it, vi } from 'vitest'
import {
  addCategory,
  addExercise,
  addModifier,
  addRecord,
} from '../../../lib/backend/mongoService'
import { createCategory } from '../../../models/AsyncSelectorOption/Category'
import { createExercise } from '../../../models/AsyncSelectorOption/Exercise'
import { createModifier } from '../../../models/AsyncSelectorOption/Modifier'
import { createRecord } from '../../../models/Record'
import { POST } from './route'

const createReq = (body = {}) =>
  new NextRequest('http://arbitraryURL', {
    body: JSON.stringify(body),
    method: 'POST',
  })

it('is disabled in production mode', async () => {
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('CI', undefined)
  const res = await POST(createReq())

  expect(res.status).toBe(403)
})

it('is not disabled in CI', async () => {
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('CI', 'true')
  const res = await POST(createReq(createCategory('quads')))

  expect(res.status).toBe(200)
})

it('returns error if invalid data is given', async () => {
  const res = await POST(createReq({ foo: 'whatami' }))

  expect(res.status).toBe(400)
})

it.each([
  ['record', createRecord('2000-01-01', 'exerciseId'), addRecord],
  ['exercise', createExercise('squats'), addExercise],
  // weight is REQUIRED to differentiate from category
  ['modifier', createModifier('belt', null), addModifier],
  ['category', createCategory('quads'), addCategory],
])('creates %s', async (_, body, fetcher) => {
  await POST(createReq(body))

  expect(fetcher).toHaveBeenCalled()
})
