import { z } from 'zod'
import { asyncSelectorOptionSchema, createAsyncSelectorOption } from '.'

// todo: instead of status, how about group? Eg, group == "grip width", containing wide and narrow.
// And groups can have a validation restraint that only 1 element of the same group can be selected
export interface Modifier extends z.infer<typeof modifierSchema> {}

export const modifierSchema = asyncSelectorOptionSchema.extend({
  weight: z.number().nullish(),
})

export const createModifier = (
  name: string,
  weight?: number | null
): Modifier => ({
  ...createAsyncSelectorOption(name),
  weight,
})
