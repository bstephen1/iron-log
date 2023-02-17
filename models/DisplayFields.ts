import { DB_UNITS, Set, Units } from './Set'

/** signifies which Set fields are visible, and which units they are using.  */
export type DisplayFields = {
  /** ordered array that denotes which fields are active and in what order */
  visibleFields: (keyof Set)[]
  /** must have units for all fields, not just visible ones.  */
  units: Units
}

/** display fields to use when no others are found. Currently does not change but
 * may be user editable down the line
 */
export const DEFAULT_DISPLAY_FIELDS: DisplayFields = {
  visibleFields: ['weight', 'reps', 'effort'],
  units: DB_UNITS,
}
