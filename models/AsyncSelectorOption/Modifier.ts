import { z } from 'zod'
import {
  AsyncSelectorOption,
  asyncSelectorOptionSchema,
  createAsyncSelectorOption,
} from '.'

// todo: instead of status, how about group? Eg, group == "grip width", containing wide and narrow.
// And groups can have a validation restraint that only 1 element of the same group can be selected
export interface Modifier extends AsyncSelectorOption {
  weight?: number | null
}

export const modifierSchema = asyncSelectorOptionSchema
  .extend({
    weight: z.number().nullish(),
  })
  .strict()

export const createModifier = (
  name: string,
  weight?: number | null
): Modifier => ({
  ...createAsyncSelectorOption(name),
  weight,
})
