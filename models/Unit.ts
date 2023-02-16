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

//------------------------------------------------------------------
// no db experiment -- not sure if there's really any value to keeping units in the db

export const units: Units = {
  weight: { lbs: 0.45359237, kg: 1 },
  distance: { m: 1, km: 1000, ft: 0.3048, mi: 1609.3471 },
  time: { sec: 1, min: 60, hr: 3600, 'HH:MM:SS': 1 },
  reps: { reps: 1 },
  effort: { rpe: 1, rir: 1 },
}

interface UnitFactors {
  [unit: string]: number
}

type Units = {
  [dimension in keyof Set]-?: UnitFactors
}

type UnitNoDb = {
  dimension: keyof Set
  symbol: string
}

export function convertUnitNoDb(
  value: number | undefined,
  dimension: keyof Set,
  source: string,
  dest: string
) {
  if (value === undefined) return value

  const src = units[dimension][source]
  const dst = units[dimension][dest]

  if (!src || !dest) {
    throw new Error('invalid unit given')
  }

  if (dimension === 'effort' && source !== dest) {
    // rpe = 10 - rir (factor is not used)
    return 10 - value
  }

  return (value * src) / dst
}

/** Convert a value to a new unit and format to 2 decimal places */
export function convertUnitFormattedNoDb(
  value: number | undefined,
  dimension: keyof Set,
  source: string,
  dest: string
) {
  if (value === undefined) return value
  // the "+" converts it from a string to a number, and removes excess zeros
  // @ts-ignore
  return +convertUnitNoDb(value, dimension, source, dest).toFixed(2)
}
