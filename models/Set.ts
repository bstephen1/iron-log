// todo: maybe some of these should be RecordOptions, at the Record level.
// todo: fuzzy: planning on displaying negative inputs as "fuzzy". Eg -7 is displayed as ~7. Allows to keep data as numeric. But is it kinda hacky?
export default interface Set {
  weight?: number
  distance?: number
  time?: number
  reps?: number
  rpe?: number
  failed?: boolean
  warmup?: boolean
  unilateral?: 'left' | 'right'
  // todo: video link
  // hr zone? Is that different from rpe / 2 ?
  // maybe bw at Record level
  bodyweight?: number
}
