import { Units } from './Units'

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
} & {
  side?: 'L' | 'R' | '' | null
}

/** Marks the structure of the set in a record. Reads as <operator> <value|range> <field>.
 *  Eg, "exactly 5 reps" means every set in the record is supposed to have 5 reps.
 *
 * Records with the same SetType are grouped together when pulling history so progress can be tracked.
 */
export interface SetType {
  field: keyof Set
  operator: SetOperator
  value?: number
  /** used for "between" operator */
  min?: number
  /** used for "between" operator */
  max?: number
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

export const DEFAULT_SET_TYPE: Readonly<SetType> = {
  operator: 'exactly',
  value: 6,
  field: 'reps',
}
