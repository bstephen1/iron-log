import { type Filter } from 'mongodb'
import { z } from 'zod'
import { asyncSelectorOptionSchema } from '.'
import { generateId, removeUndefinedKeys } from '../../lib/util'
import { ArrayMatchType, buildMatchTypeFilter } from '../ArrayMatchType'
import { attributesSchema } from '../Attributes'
import { displayFieldsSchema } from '../DisplayFields'
import { noteSchema } from '../Note'
import { Status } from '../Status'
import { apiArraySchema } from '../schemas'

export interface Exercise extends z.infer<typeof exerciseSchema> {}
export const exerciseSchema = asyncSelectorOptionSchema.extend({
  attributes: attributesSchema.default({}),
  notes: z.array(noteSchema).default([]),
  displayFields: displayFieldsSchema.nullish().default(null),
  weight: z.number().nullish().default(null),
  categories: z.array(z.string()).default([]),
  modifiers: z.array(z.string()).default([]),
})

// todo: make this based on the schema. Requires some thought because we
// don't want to parse it immediately, only when sending to the api.
// So may require a separate client model with only the fields the client can
// edit (everything except id?)
export const createExercise = (
  name: string,
  {
    attributes = {},
    notes = [],
    displayFields = null,
    weight = null,
    categories = [],
    modifiers = [],
    status = Status.active,
  }: Partial<Exercise> = {}
): Exercise => ({
  _id: generateId(),
  name,
  attributes,
  notes,
  displayFields,
  weight,
  categories,
  modifiers,
  status,
})

export type ExerciseQuery = z.infer<typeof exerciseQuerySchema>
export const exerciseQuerySchema = z
  .object({
    bodyweight: z.coerce.boolean(),
    unilateral: z.coerce.boolean(),
    category: apiArraySchema,
    modifier: apiArraySchema,
    status: z.enum(Status),
  })
  .partial()
  .transform(({ category, modifier, bodyweight, unilateral, ...rest }) => {
    const filter: Filter<Exercise> = {
      ...rest,
      // it only makes sense to query exercises with a partial array match
      categories: buildMatchTypeFilter(category, ArrayMatchType.Partial),
      modifiers: buildMatchTypeFilter(modifier, ArrayMatchType.Partial),
      'attributes.unilateral': unilateral,
      'attributes.bodyweight': bodyweight,
    }
    return removeUndefinedKeys(filter)
  })
