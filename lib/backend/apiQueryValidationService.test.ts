import { ApiError } from 'next/dist/server/api-utils'
import { v1 as invalidUuid } from 'uuid'
import { generateId } from '../util'
import { validateId } from './apiQueryValidationService'

describe('validateId', () => {
  it('throws error when not a string', () => {
    expect(() => validateId(undefined)).toThrow(ApiError)
    expect(() => validateId([generateId()])).toThrow(ApiError)
  })

  it('throws error when id format is invalid', () => {
    expect(() => validateId('invalid')).toThrow(ApiError)
    expect(() => validateId(invalidUuid())).toThrow(ApiError)
  })

  it('returns id when valid', () => {
    const id = generateId()
    expect(validateId(id)).toBe(id)
  })
})
