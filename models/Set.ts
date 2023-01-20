// todo: maybe some of these should be RecordOptions, at the Record level.
// todo: fuzzy: planning on displaying negative inputs as "fuzzy". Eg -7 is displayed as ~7. Allows to keep data as numeric. But is it kinda hacky?

/*
todo: refactor set: pull out fields to top level. Unilateral becomes another column in the stack. It isn't selectable in the display menu; always shown when modifier is set.
Edit: OR, unilateral can be two modifiers (for left/right) and no other changes. Just have two records instead. Maybe do that for now and see how it feels in practice. 
I guess technically you don't HAVE to do both left and right sets... but usually I want to see both when looking at records, to compare left vs right.

failed / warmup are Effort values? Make effort a select instead of number? Expected values are actually limited to about 5-10 in .5 steps. Plus F and W for failed / warmup.
Making a Select addresses issues with adding F and W to numeric input (would otherwise have to change to string with restricted values, and mobile keyboard will have to choose between qwerty or numeric keyboard)
Could also possibly use the mui Rating component 5 stars in .5 steps, plus warmup/fail stars (but those should be whole only). That's kind of a space hog though. Maybe a dialog to select the value.
Alternatively, can use the rest of the rpe scale for them. Warmups are 0-5 or so, failures are 11. Maybe make the range for what counts as warmups user defined (eg, 0-3, 0-5) with minimum of just 0.
And for failure it can be anything > 10 (or < 0 for rir). I guess you can rate the degree of failure. Eg, a slow grinder that you just barely fail vs not being able to control even the eccentric. Let the user decide their own scale?


bodyweight is pulled out to Record. It is redundant to store for every set, especially since sets are inseparable from their containing Record. 
Set will need to be passed bodyweight though when the modifier is on. Can have standard weight column for added weight and a special optional column for total weight (added + BW)
Recording bodyweight should add the value as a weigh in (fuzzy, with clothes?). May want to be able to input bodyweight on any record? May want it at the Session level?

"Smart" bodyweight estimate: If no bodyweight given, use the most recent measurement, marked as fuzzy. The next time there is a bodyweight measurement, All records between the previous most recent
and the new most recent bodyweight can be updated with a linear progression towards the new bodyweight. When entering bodyweight you can also specify clothing weight, which will automatically mark
the measurement as fuzzy. Should it just be a boolean (eg, 1 extra kg) or allow you to manually enter the clothing weight?

Allow modifiers to be added as "equipment" that will add to total weight. So modifiers can store a "weight" property. Then bodyweight modifier can be treated as "equipment" and add to the total weight.
Sum all modifiers with equipment weight plus "added weight" (plate weight) to get total weight. If none, there is only total weight. The display fields will also have to watch modifiers and
switch from just a "weight" column to added/total weight columns. 

"locking columns" (eg, "doing 5 reps, weight / rpe variable") not necessary. This would only have value in relation to other records, so can be achieved via a filter when querying history.
Eg, if you are doing 5 reps, query history for most recent records of this exercise with a set that includes 5 reps. If a modifier like amrap/myo, query most recent with those modifiers.
Could also add arbitrary modifiers to group records. Maybe a "locked reps" modifier would make history queries faster 
*/

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
}

// todo: certain exercises can have default setFields
