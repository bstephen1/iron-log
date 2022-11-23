// todo: maybe some of these should be RecordOptions, at the Record level.
// todo: fuzzy: planning on displaying negative inputs as "fuzzy". Eg -7 is displayed as ~7. Allows to keep data as numeric. But is it kinda hacky?

/*
todo: refactor set: pull out fields to top level. Unilateral becomes another column in the stack. It isn't selectable in the display menu; always shown when modifier is set.
Edit: OR, unilateral can be two modifiers (for left/right) and no other changes. Just have two records instead. Maybe do that for now and see how it feels in practice. 
I guess technically you don't HAVE to do both left and right sets... but usually I want to see both when looking at records, to compare left vs right.

failed / warmup are Effort values? Make effort a select instead of number? Expected values are actually limited to about 5-10 in .5 steps. Plus F and W for failed / warmup.
Making a Select addresses issues with adding F and W to numeric input (would otherwise have to change to string with restricted values, and mobile keyboard will have to choose between qwerty or numeric keyboard)
Could also possibly use the mui Rating component 5 stars in .5 steps, plus warmup/fail stars (but those should be whole only). That's kind of a space hog though. Maybe a dialog to select the value.

bodyweight is pulled out to Record. It is redundant to store for every set, especially since sets are inseparable from their containing Record. 
Set will need to be passed bodyweight though when the modifier is on. Can have standard weight column for added weight and a special optional column for total weight (added + BW)

"locking columns" (eg, "doing 5 reps, weight / rpe variable") not necessary. This would only have value in relation to other records, so can be achieved via a filter when querying history.
Eg, if you are doing 5 reps, query history for most recent records of this exercise with a set that includes 5 reps. If a modifier like amrap/myo, query most recent with those modifiers.
Could also add arbitrary modifiers to group records. Maybe a "locked reps" modifier would make history queries faster 
*/
// export default class Set {
//   constructor(
//     public weight?: number,
//     public unilateral?: 'left' | 'right',
//     public failed = false,
//     public warmup = false
//   ) {}
// }

// todo: mapped type?
// export interface SetUnits {
//   weight?: 'kg' | 'lb'
//   distance?: 'km' | 'm' | 'ft' | 'mi'
//   time?: 'seconds' | 'stopwatch' // this is more "format type" than unit...
//   // rpe?: 'rpe' | 'rir' these should be placeholders...
// }

export default interface Set {
  weight?: number
  distance?: number
  time?: number
  reps?: number
  effort?: number
  side?: 'left' | 'right'
}

// todo: certain exercises can have default setFields
