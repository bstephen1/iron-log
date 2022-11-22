// todo: maybe some of these should be RecordOptions, at the Record level.
// todo: fuzzy: planning on displaying negative inputs as "fuzzy". Eg -7 is displayed as ~7. Allows to keep data as numeric. But is it kinda hacky?
export default class Set {
  constructor(
    public fields: SetFields = {},
    public bodyweight?: number,
    public unilateral?: 'left' | 'right',
    public failed = false,
    public warmup = false
  ) {}
}

// todo: mapped type?
// export interface SetUnits {
//   weight?: 'kg' | 'lb'
//   distance?: 'km' | 'm' | 'ft' | 'mi'
//   time?: 'seconds' | 'stopwatch' // this is more "format type" than unit...
//   // rpe?: 'rpe' | 'rir' these should be placeholders...
// }

export interface SetFields {
  weight?: number
  distance?: number
  time?: number
  reps?: number
  effort?: number
}

// todo: certain exercises can have default setFields
