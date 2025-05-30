import { z } from 'zod'
import { DB_UNITS, type Units, unitsSchema } from './Units'

/** An exercise set. */
export interface Set extends z.infer<typeof setSchema> {}
// tricky to define this schema since we need to change the value types to number,
// plus overwrite "side"
const dimensions = unitsSchema.keyof().exclude(['side']).options
export const setSchema = z
  .object(
    dimensions.reduce(
      (prev, key) => ({ ...prev, [key]: z.number().nullish() }),
      // the key definition is the same idea as making a type from a const array
      {} as {
        [key in (typeof dimensions)[number]]: z.ZodOptional<
          z.ZodNullable<z.ZodNumber>
        >
      }
    )
  )
  .extend({ side: z.enum(['L', 'R', '']).nullish() })

export type SetOperator = (typeof setOperators)[number]
export const setOperators = [
  'exactly',
  'at most',
  'at least',
  'between',
  'total',
  'rest',
] as const

/** Marks the structure of the set in a record. Reads as <operator> <value|range> <field>.
 *  Eg, "exactly 5 reps" means every set in the record is supposed to have 5 reps.
 *
 * Records with the same SetType are grouped together when pulling history so progress can be tracked.
 *
 * Note: though min/max are only used when operator is "between", a set can still contain them
 * otherwise. They just won't be meaningful until/unless the operator becomes "between".
 * This allows value/min/max to be saved when switching between operators.
 */
export interface SetType extends z.infer<typeof setTypeSchema> {}
export const setTypeSchema = z.object({
  field: unitsSchema.keyof(),
  operator: z.enum(setOperators),
  value: z.coerce.number().optional(),
  /** used for "between" operator */
  min: z.coerce.number().optional(),
  /** used for "between" operator */
  max: z.coerce.number().optional(),
})

export const DEFAULT_SET_TYPE: Readonly<SetType> = {
  operator: 'exactly',
  value: 6,
  field: 'reps',
}

/** Returns the total value for the given field over all sets
 * when operator is "total", otherwise zero. */
export const calculateTotalValue = (
  sets: Set[],
  { field, operator }: SetType
) => {
  return operator === 'total'
    ? sets.reduce((total, set) => total + Number(set[field] ?? 0), 0)
    : 0
}

export const stringifySetType = (
  { operator, min = 0, max = 0, value = 0, field }: SetType,
  units?: Units
) =>
  `${operator} ${operator === 'between' ? min + ' and ' + max : value} ${(units ?? DB_UNITS)[field]}`
