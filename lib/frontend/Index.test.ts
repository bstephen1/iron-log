import { describe, expect, it } from 'vitest'
import { arrayToIndex } from './Index'

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
