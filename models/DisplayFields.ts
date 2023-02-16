import Record from './Record'
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

/** transform a string of modifier names into a hashed value for DisplayFields */
export const hashModifiers = (modifiers: string[]) =>
  modifiers.sort().toString()

/** get current displayFields for a Record. A Record may be using its exercise's default fields
 * or the global default fields.
 */
// Note -- this function and hashModifiers() are here rather than defined on the Record / Exercise
// classes directly so updates using the spread operator continue to work, rather than having to
// use "new" and assign values explicitly.
export const getDisplayFields = (record?: Record): DisplayFields => {
  if (!record) return DEFAULT_DISPLAY_FIELDS

  const { exercise, activeModifiers } = record

  const hashed = hashModifiers(activeModifiers)
  return exercise?.savedDisplayFields?.[hashed] ?? DEFAULT_DISPLAY_FIELDS
}
