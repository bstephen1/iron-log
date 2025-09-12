import { DB_UNITS, type Units } from './Units'

/** An exercise set. */
export type Set = {
  [field in keyof Omit<Units, 'side'>]?: number
} & {
  side?: 'L' | 'R' | '' | null
}

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
export interface SetType {
  field: keyof Units
  operator: SetOperator
  value?: number
  min?: number
  max?: number
}

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
  if (operator !== 'total' || field === 'side') return 0

  return sets.reduce((total, set) => total + (set[field] ?? 0), 0)
}

export const stringifySetType = (
  { operator, min = 0, max = 0, value = 0, field }: SetType,
  units?: Units
) =>
  `${operator} ${operator === 'between' ? `${min} and ${max}` : value} ${(units ?? DB_UNITS)[field]}`
