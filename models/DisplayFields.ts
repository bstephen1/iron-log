import { defaultSetUnits, Set, SetUnits } from './Set'

export type DisplayFields = {
  activeFields: (keyof Set)[]
  units: SetUnits
}

export const defaultDisplayFields: DisplayFields = {
  activeFields: ['weight', 'reps', 'effort'],
  units: defaultSetUnits,
}
