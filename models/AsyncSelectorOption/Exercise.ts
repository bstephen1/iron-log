import { type AsyncSelectorOption } from '.'
import { generateId } from '../../lib/util'
import { type Attributes } from '../Attributes'
import { type DisplayFields } from '../DisplayFields'
import { type Note } from '../Note'
import { Status } from '../Status'

export interface Exercise extends AsyncSelectorOption {
  attributes: Attributes
  notes: Note[]
  displayFields: DisplayFields | null
  weight?: number | null
  categories: string[]
  modifiers: string[]
}

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
