import { AsyncSelectorOption } from '.'
import Attributes from '../Attributes'
import { DisplayFields } from '../DisplayFields'
import Note from '../Note'

export default class Exercise extends AsyncSelectorOption {
  attributes: Attributes
  notes: Note[]
  // Originally this was a map with keys for each subset of modifier groupings
  // for the exercise, but that proved to be frustrating and not very useful
  // in practice.
  /** Use custom displayFields. Uses default displayFields if not set. */
  displayFields?: DisplayFields | null
  /** inherent base equipment weight of the exercise */
  weight?: number | null
  categories: string[]
  modifiers: string[]

  constructor(
    public name: string,
    {
      status,
      attributes,
      notes,
      displayFields,
      weight,
      categories,
      modifiers,
    }: Partial<Omit<Exercise, 'name'>> = {},
  ) {
    super(name, status)
    this.attributes = attributes ?? {}
    this.notes = notes ?? []
    this.displayFields = displayFields
    this.weight = weight
    this.categories = categories ?? []
    this.modifiers = modifiers ?? []
  }
}
