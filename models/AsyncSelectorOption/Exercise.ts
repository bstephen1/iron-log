import { generateId } from '../../lib/id'
import type { Attributes } from '../Attributes'
import type { DisplayFields } from '../DisplayFields'
import type { Note } from '../Note'
import { Status } from '../Status'
import type { AsyncSelectorOption } from '.'

export interface Exercise extends AsyncSelectorOption {
  attributes: Attributes
  notes: Note[]
  displayFields: DisplayFields | null
  weight?: number | null
  categories: string[]
  modifiers: string[]
}

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
