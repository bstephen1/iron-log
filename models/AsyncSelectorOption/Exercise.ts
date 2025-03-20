import { z } from 'zod'
import { asyncSelectorOptionSchema, createAsyncSelectorOption } from '.'
import { attributesSchema } from '../Attributes'
import { displayFieldsSchema } from '../DisplayFields'
import { noteSchema } from '../Note'
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
