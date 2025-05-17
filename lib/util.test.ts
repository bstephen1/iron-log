import { v6 as uuidv6 } from 'uuid'
import { idSchema } from '../models/schemas'
import {
  arrayToIndex,
  capitalize,
  generateId,
  removeUndefinedKeys,
} from './util'
import { it, describe, expect } from 'vitest'

describe('validateId', () => {
  it('throws error when id format is invalid', () => {
    expect(() => idSchema.parse('invalid')).toThrow()
    expect(() => idSchema.parse(uuidv6())).toThrow()
  })

  it('returns id when valid', () => {
    const id = generateId()
    expect(idSchema.parse(id)).toBe(id)
  })
})

describe('arrayToIndex', () => {
  interface Sample {
    a: string
    b: string
  }

  it('handles undefined array', () => {
    expect(arrayToIndex<Sample>('a', undefined)).toMatchObject({})
  })

  it('creates string index on given field', () => {
    const obj1: Sample = { a: 'a1', b: 'b1' }
    const obj2: Sample = { a: 'a2', b: 'b2' }

    const indexA = arrayToIndex<Sample>('a', [obj1, obj2])
    const indexB = arrayToIndex<Sample>('b', [obj1, obj2])

    expect(indexA).toMatchObject({ a1: obj1, a2: obj2 })
    expect(indexB).toMatchObject({ b1: obj1, b2: obj2 })
  })

  it('throws error when given invalid index type', () => {
    const badObj = { a: [1, 2, 3] }

    expect(() => arrayToIndex('a', [badObj])).toThrow(Error)
  })
})

describe('capitalize', () => {
  it('capitalizes first letter of string', () => {
    expect(capitalize('string')).toBe('String')
    expect(capitalize('string string')).toBe('String string')
  })

  it('handles empty string', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('removeUndefinedKeys', () => {
  it('removes undefined keys', () => {
    expect(removeUndefinedKeys({ a: 1, b: undefined })).toEqual({ a: 1 })
  })

  it('does not remove falsy keys', () => {
    expect(removeUndefinedKeys({ a: '', b: {} })).toEqual({ a: '', b: {} })
  })

  // if we did remove nested keys, we might expect nested objects that become
  // empty to be removed
  // ie, {a: {b: undefined}} -> {a: undefined} -> {}
  it('does not remove nested undefined keys', () => {
    expect(removeUndefinedKeys({ a: { b: undefined } })).toEqual({
      a: { b: undefined },
    })
  })
})
