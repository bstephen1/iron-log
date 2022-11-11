// todo: maybe some of these should be RecordOptions, at the Record level.
// todo: could combine cardio into this?
export default interface StandardSet {
  primary?: number
  secondary?: number
  tertiary?: number
  quarternary?: number // if weight + reps + time + distance is a use case
  // although, if we're already up to quarternary maybe an array is better.
  effort?: number
  failed?: boolean
  // maybe these at Record level
  warmup?: boolean
  unilateral?: 'left' | 'right'
  bodyweight?: number
}

// todo: something like SetAtom for primary/secondary etc values?
// all units should be handled on the frontend
// need something that says what primary/secondary etc represent.
// That can be at Record level? The units adornment of setType?

// export interface SetAtom {
//   type: string
//   label: string
//   value: number
//   fuzzy: boolean // is this number an estimate? time, distance, reps, bodyweight
// }
