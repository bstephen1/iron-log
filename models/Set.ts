// todo: maybe some of these should be RecordOptions, at the Record level.
// todo: fuzzy: planning on displaying negative inputs as "fuzzy". Eg -7 is displayed as ~7. Allows to keep data as numeric. But is it kinda hacky?
export default interface Set {
  fields: SetFields
  failed?: boolean
  warmup?: boolean
  unilateral?: 'left' | 'right'
  // todo: video link
  // hr zone? Is that different from rpe / 2 ?
  // maybe bw at Record level
  bodyweight?: number
}

// todo: mapped type?
export interface SetUnits {
  weight?: 'kg' | 'lb'
  distance?: 'km' | 'm' | 'ft' | 'mi'
  time?: 'seconds' | 'stopwatch'
  // rpe?: 'rpe' | 'rir'
}

export interface SetFields {
  weight?: number
  distance?: number
  time?: number
  reps?: number
  rpe?: number
}

// indeces for which fields are displayed in a record. Lower indeces are further left. Negative indeces are skipped.
export class SetLayout {
  constructor(
    public weight = -1,
    public distance = -1,
    public time = -1,
    public reps = -1,
    public rpe = -1
  ) {}
}

// todo: should SetLayout be composed of eg SetAtoms like:
// {label, index, units}
// don't want to store units... just a frontend class? Label not needed...
