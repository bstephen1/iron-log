import { convertUnit } from './Units'
import { it, describe, expect } from 'vitest'

describe('convertUnit', () => {
  it('converts effort', () => {
    expect(convertUnit(3, 'effort', 'rir', 'rpe')).toBe(7)
    expect(convertUnit(7, 'effort', 'rpe', 'rir')).toBe(3)
  })

  it('converts time', () => {
    expect(convertUnit(60, 'time', 'sec', 'min')).toBe(1)
    expect(convertUnit(2, 'time', 'hr', 'min')).toBe(120)
  })

  it('converts distance', () => {
    expect(convertUnit(2300, 'distance', 'm', 'km')).toBe(2.3)
    expect(convertUnit(2, 'distance', 'm', 'ft')?.toFixed(2)).toBe('6.56')
    expect(convertUnit(200, 'distance', 'm', 'mi')?.toFixed(2)).toBe('0.12')
  })

  it('converts weight', () => {
    expect(convertUnit(20, 'weight', 'kg', 'lbs')?.toFixed(0)).toBe('44')
    expect(convertUnit(220, 'weight', 'lbs', 'kg')?.toFixed(0)).toBe('100')
  })

  it('converts weight with extra weight', () => {
    expect(convertUnit(undefined, 'weight', 'kg', 'lbs')).toBe(undefined)
    expect(convertUnit(undefined, 'weight', 'kg', 'lbs', 5, 0)).toBe(11)
    expect(convertUnit(10, 'weight', 'kg', 'lbs', 10, 0)).toBe(44)
  })

  it('rounds values correctly', () => {
    expect(convertUnit(25.5, 'weight', 'kg', 'lbs', 0, 1)).toBe(56.2)
    expect(convertUnit(365.25, 'weight', 'lbs', 'kg', 0, 2)).toBe(165.67)
    expect(convertUnit(5, 'weight', 'kg', 'lbs', 0, 1)).toBe(11)
  })
})
