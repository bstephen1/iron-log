import { z } from 'zod'
import { TIME_FORMAT } from '../lib/frontend/constants'

/*
todo: 

failed / warmup are Effort values? Make effort a select instead of number? Expected values are actually limited to about 5-10 in .5 steps. Plus F and W for failed / warmup.
Making a Select addresses issues with adding F and W to numeric input (would otherwise have to change to string with restricted values, and mobile keyboard will have to choose between qwerty or numeric keyboard)
Could also possibly use the mui Rating component 5 stars in .5 steps, plus warmup/fail stars (but those should be whole only). That's kind of a space hog though. Maybe a dialog to select the value.
Alternatively, can use the rest of the rpe scale for them. Warmups are 0-5 or so, failures are 11. Maybe make the range for what counts as warmups user defined (eg, 0-3, 0-5) with minimum of just 0.
And for failure it can be anything > 10 (or < 0 for rir). I guess you can rate the degree of failure. Eg, a slow grinder that you just barely fail vs not being able to control even the eccentric. Let the user decide their own scale?

*/

/** An exercise set. */
export type Set = {
  [field in keyof Omit<Units, 'side'>]?: number
} & { side?: 'L' | 'R' | '' | null }

/** Specifies the possible units for each field in a set.
 *  A unit with the same value as its key is considered to be unitless.
 */
export interface Units extends z.infer<typeof unitsSchema> {}
export const unitsSchema = z.strictObject({
  weight: z.enum(['kg', 'lbs']),
  distance: z.enum(['m', 'km', 'ft', 'mi', 'cm', 'in']),
  /** Considered having a separate HH:mm:ss and mm:ss but then the latter
   *  would be overflow limited, so you wouldn't always be able to freely swap units.
   *  May revisit if real usage with HH is cumbersome.
   */
  time: z.enum(['sec', 'min', 'hr', TIME_FORMAT]),
  reps: z.enum(['reps']),
  side: z.enum(['side']),
  effort: z.enum(['rpe', 'rir']),
})

/** Units used to store sets in the database. No matter the units used to display
 * data on the frontend, they must be converted to these units before sending to the db.
 */
export const DB_UNITS: Readonly<Units> = {
  weight: 'kg',
  distance: 'm',
  time: 'sec',
  reps: 'reps',
  side: 'side',
  effort: 'rpe',
}

/** Lists all possible units and their factors used in conversions.
 *
 * A factor is defined such that the base unit of the same dimension times that factor
 * equals the desired unit.
 *
 * E.g., for weight the base unit is 1kg, so the lbs factor f is defined s.t. 1kg * f = 1lb
 *
 * Some dimensions are unitless, or factors don't apply since they can't be converted via
 * multiplication. In those cases the factors should be set to 1 and the conversion handled
 * manually in convertUnit().
 */
const factors: {
  readonly [dimension in keyof Units]: {
    readonly [unit in Units[dimension]]: number
  }
} = {
  weight: { kg: 1, lbs: 0.45359237 },
  distance: { m: 1, km: 1000, ft: 0.3048, mi: 1609.3471, cm: 0.01, in: 0.0254 },

  time: { sec: 1, min: 60, hr: 3600, [TIME_FORMAT]: 1 },
  reps: { reps: 1 },
  side: { side: 1 },
  effort: { rpe: 1, rir: 1 },
  // const assertion is being favored over Object.freeze(), which is more strict but doesn't freeze nested fields
} as const

/** Convert a unit from source to dest type. */
export function convertUnit<Dimension extends keyof Units>(
  value: number | undefined,
  dimension: Dimension,
  source: Units[Dimension],
  dest: Units[Dimension],
  /**  For now, extraValue's units can only be DB_UNITS[dimension]. The only projected
   *  use is for weight (plate weight + extra weight = total weight) */
  extraValue = 0,
  /** number of decimals to round to */
  roundedDecimals?: number
): number | undefined {
  // we want to show extraValue if it exists and value is undefined
  if (!value && !extraValue) return value // value could be 0 or undefined

  const convertedValue = convertUnitHelper(value, dimension, source, dest) ?? 0

  // only convert if it exists
  const convertedExtraValue = extraValue
    ? (convertUnitHelper(extraValue, dimension, DB_UNITS[dimension], dest) ?? 0)
    : 0

  const sum = convertedValue + convertedExtraValue
  // the "+" converts it from a string to a number, and removes excess zeros
  return roundedDecimals !== undefined ? +sum.toFixed(roundedDecimals) : sum
}

function convertUnitHelper<Dimension extends keyof Units>(
  value: number | undefined,
  dimension: Dimension,
  source: Units[Dimension],
  dest: Units[Dimension]
) {
  // This would work if value === 0 too, but have to watch out for "effort" dimension.
  if (value === undefined) return undefined

  const sourceFactor: number = factors[dimension][source]
  const destFactor: number = factors[dimension][dest]

  if (dimension === 'effort' && source !== dest) {
    // rpe = 10 - rir (factor is not used)
    return 10 - value
  }

  return (value * sourceFactor) / destFactor
}
