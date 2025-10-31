import { describe, expect, it } from 'vitest'
import { removeUndefinedKeys } from './object'

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
