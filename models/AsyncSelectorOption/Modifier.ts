import { z } from 'zod'
import { asyncSelectorOptionSchema, createAsyncSelectorOption } from '.'

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
