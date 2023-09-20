import { AsyncSelectorOption } from 'components/form-fields/selectors/AsyncSelector'
import Attributes from './Attributes'
import { DisplayFields } from './DisplayFields'
import Note from './Note'
import { Status } from './Status'

export default class Exercise extends AsyncSelectorOption {
  constructor(
    public name: string,
    public status: Status = Status.active,
    public attributes: Attributes = {},
    public notes: Note[] = [],
    // Originally this was a map with keys for each subset of modifier groupings
    // for the exercise, but that proved to be frustrating and not very useful
    // in practice.
    /** Use custom displayFields. Uses default displayFields if not set. */
    public displayFields?: DisplayFields | null,
    /** inherent base equipment weight of the exercise */
    public weight?: number | null,
    public categories: string[] = [],
    public modifiers: string[] = []
  ) {
    super(name, status)
  }
}
