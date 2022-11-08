// todo: maybe some of these should be RecordOptions, at the Record level.
// todo: could combine cardio into this?
export default interface StandardSet {
  primary?: number
  secondary?: number
  effort?: number
  failed?: boolean
  // maybe these at Record level
  warmup?: boolean
  unilateral?: 'left' | 'right'
  bodyweight?: number
  // included for now in case reps + time + distance is a use case
  time?: number
  distance?: number
}
