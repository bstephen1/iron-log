import { AsyncSelectorOption } from 'components/form-fields/selectors/AsyncSelector'
import Attributes from './Attributes'
import { DisplayFields } from './DisplayFields'
import Note from './Note'
import { Status } from './Status'

export default class Exercise extends AsyncSelectorOption {
  constructor(
    public name: string,
    public status: Status = Status.active,
    public attributes?: Attributes,
    public notes: Note[] = [],
    // We can either use undefined or manually assign default displayFields.
    // Using undefined means we can avoid repeating the defaults in every record,
    // updating the defaults only updates in one place, and existing prod records
    // are backwards compatible.
    // Edit: Actually, some exercises in prod have null displayFields instead
    // of undefined. Not sure why, but doesn't really affect anything except for
    // manual mongo queries.
    // Originally this was a map with keys for each subset of modifier groupings
    // for the exercise, but that proved to be frustrating and not very useful
    // in practice.
    public displayFields?: DisplayFields,
    /** inherent base equipment weight of the exercise */
    public weight?: number,
    public categories: string[] = [],
    public modifiers: string[] = []
  ) {
    super(name, status)
  }
}
