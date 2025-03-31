import { calculateTotalValue, stringifySetType } from './Set'
import { DB_UNITS } from './Units'

describe('calculateTotalReps', () => {
  it('sums all reps with "total" operator', () => {
    expect(
      calculateTotalValue(
        [{ reps: 1 }, { reps: 2, time: 6 }, { reps: 3 }, { reps: 0 }, {}],
        {
          field: 'reps',
          operator: 'total',
          value: 1,
        }
      )
    ).toBe(6)
    expect(
      calculateTotalValue([{ distance: 1 }, { distance: 2 }], {
        field: 'distance',
        operator: 'total',
        value: 1,
      })
    ).toBe(3)
  })

  it('returns zero when operator is not "total"', () => {
    expect(
      calculateTotalValue([{ reps: 1 }, { reps: 2 }], {
        field: 'reps',
        operator: 'exactly',
        value: 1,
      })
    ).toBe(0)
  })
})

describe('stringifySetType', () => {
  it('prints setType with value', () => {
    expect(
      stringifySetType({ operator: 'exactly', value: 6, field: 'reps' })
    ).toBe('exactly 6 reps')
  })

  it('prints setType with range', () => {
    expect(
      stringifySetType({ operator: 'between', min: 3, max: 6, field: 'time' })
    ).toBe('between 3 and 6 sec')
  })

  it('uses provided units', () => {
    expect(
      stringifySetType(
        { operator: 'exactly', field: 'distance' },
        { ...DB_UNITS, distance: 'cm' }
      )
    ).toBe('exactly 0 cm')
  })
})
