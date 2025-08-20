import { z } from 'zod'
import { asyncSelectorOptionSchema } from '.'
import { generateId } from '../../lib/util'
import { attributesSchema } from '../Attributes'
import { displayFieldsSchema } from '../DisplayFields'
import { noteSchema } from '../Note'
import { Status } from '../Status'

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
