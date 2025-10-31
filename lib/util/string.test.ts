import { describe, expect, it } from 'vitest'
import { capitalize } from './string'

describe('capitalize', () => {
  it('capitalizes first letter of string', () => {
    expect(capitalize('string')).toBe('String')
    expect(capitalize('string string')).toBe('String string')
  })

  it('handles empty string', () => {
    expect(capitalize('')).toBe('')
  })
})
