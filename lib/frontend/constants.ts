import Set from '../../models/Set'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const validDateStringRegex = /^\d{4}-\d{2}-\d{2}$/

type SetUnits = { [key in keyof Set]: string }
// todo: user pref
export const DEFAULT_UNITS: SetUnits = {
  weight: 'kg',
  effort: 'rpe',
  time: 'sec',
  distance: 'm',
}
