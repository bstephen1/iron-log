import { SetUnits } from '../../models/Set'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const validDateStringRegex = /^\d{4}-\d{2}-\d{2}$/

// todo: tmp until users are implemented
export const DEFAULT_UNITS: SetUnits = {
  weight: 'kg',
  time: 'seconds',
  distance: 'mi',
}
// export const DEFAULT_SET_FIELDS = { weight: 0, reps: 1, rpe: 2, time: -1, distance: -1 }
// ordered array of Set keys?
export const DEFAULT_SET_LAYOUT = { weight: 0, reps: 1, rpe: 2 }
