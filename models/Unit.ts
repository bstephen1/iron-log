import { Set } from './Set'

export interface Unit {
  /** the shorthand symbol. Eg, lbs, kg */
  symbol: string
  /** the written name. Eg, pound, kilogram */
  name: string
  /** the dimension of measurement. Units can only be converted if they share a dimension */
  dimension: keyof Set
  /** factor to multiply by, compared to the base unit of the dimension */
  factor: number
}

export function convertUnit(value: number, source: Unit, dest: Unit) {
  if (source.dimension !== dest.dimension) {
    throw new Error('cannot convert units of different dimensions')
  }

  if (source.dimension === 'effort') {
    // rpe = 10 - rir (factor is not used)
    return 10 - value
  }

  return (value * source.factor) / dest.factor
}

/** Convert a value to a new unit and format to 2 decimal places */
export function convertUnitFormatted(value: number, source: Unit, dest: Unit) {
  // the "+" converts it from a string to a number, and removes excess zeros
  return +convertUnit(value, source, dest).toFixed(2)
}
