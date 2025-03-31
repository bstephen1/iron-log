import { Filter } from 'mongodb'
import { z } from 'zod'
import { asyncSelectorOptionSchema, createAsyncSelectorOption } from '.'
import { removeUndefinedKeys, toArray } from '../../lib/util'
import { attributesSchema } from '../Attributes'
import { displayFieldsSchema } from '../DisplayFields'
import { noteSchema } from '../Note'
import {
  ArrayMatchType,
  buildMatchTypeFilter,
} from '../query-filters/ArrayMatchType'
import { Status } from '../Status'

export interface Exercise extends z.infer<typeof exerciseSchema> {}
export const exerciseSchema = asyncSelectorOptionSchema.extend({
  attributes: attributesSchema,
  notes: z.array(noteSchema),
  displayFields: displayFieldsSchema.nullish(),
  weight: z.number().nullish(),
  categories: z.array(z.string()),
  modifiers: z.array(z.string()),
})

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
  ...createAsyncSelectorOption(name, status),
  attributes,
  notes,
  displayFields,
  weight,
  categories,
  modifiers,
})

export type ExerciseQuery = z.input<typeof exerciseQuerySchema>
export const exerciseQuerySchema = z
  .object({
    bodyweight: z.coerce.boolean(),
    unilateral: z.coerce.boolean(),
    category: z.preprocess(toArray, z.array(z.string())),
    modifier: z.preprocess(toArray, z.array(z.string())),
    status: z.nativeEnum(Status),
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
