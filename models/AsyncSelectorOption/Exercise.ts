import { AsyncSelectorOption, createAsyncSelectorOption } from '.'
import Attributes from '../Attributes'
import { DisplayFields } from '../DisplayFields'
import Note from '../Note'
import { Status } from '../Status'

export interface Exercise extends AsyncSelectorOption {
  attributes: Attributes
  notes: Note[]
  displayFields?: DisplayFields | null
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
  }: Partial<Exercise> = {}
): Exercise => ({
  ...createAsyncSelectorOption(name, Status.active),
  attributes,
  notes,
  displayFields,
  weight,
  categories,
  modifiers,
})
