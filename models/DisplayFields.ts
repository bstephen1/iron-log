import { defaultSetUnits, Set, SetUnits } from './Set'

/** signifies which Set fields are visible, and which units they are using.  */
export type DisplayFields = {
  /** ordered array that denotes which fields are active and in what order */
  visibleFields: (keyof Set)[]
  /** must have units for all fields, not just visible ones.  */
  units: SetUnits
}

export const defaultDisplayFields: DisplayFields = {
  visibleFields: ['weight', 'reps', 'effort'],
  units: defaultSetUnits,
}
