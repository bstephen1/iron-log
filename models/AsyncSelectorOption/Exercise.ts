import { Filter } from 'mongodb'
import { z } from 'zod'
import { asyncSelectorOptionSchema } from '.'
import { removeUndefinedKeys, toArray } from '../../lib/util'
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

export const createExercise = (
  name: string,
  draft: Partial<Exercise> = {}
): Exercise => exerciseSchema.parse({ name, ...draft })

export type ExerciseQuery = z.input<typeof exerciseQuerySchema>
export const exerciseQuerySchema = z
  .object({
    bodyweight: z.coerce.boolean(),
    unilateral: z.coerce.boolean(),
    category: apiArraySchema,
    modifier: apiArraySchema,
    status: z.nativeEnum(Status),
  })
  .partial()
  .transform(({ category, modifier, bodyweight, unilateral, ...rest }) => {
    const filter: Filter<Exercise> = {
      ...rest,
      // it only makes sense to query exercises with a partial array match
      categories: buildMatchTypeFilter(
        toArray(category),
        ArrayMatchType.Partial
      ),
      modifiers: buildMatchTypeFilter(
        toArray(modifier),
        ArrayMatchType.Partial
      ),
      'attributes.unilateral': unilateral,
      'attributes.bodyweight': bodyweight,
    }
    return removeUndefinedKeys(filter)
  })
