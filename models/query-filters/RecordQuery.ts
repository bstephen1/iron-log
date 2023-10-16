import { SetType } from 'models/Record'
import DateRangeQuery from './DateRangeQuery'
import { ArrayMatchType } from './MongoQuery'

export type RecordQuery = DateRangeQuery &
  Partial<SetType> & {
    /** YYYY-MM-DD */
    date?: string
    /** Exercise name.  */
    exercise?: string
    /** Active modifier names */
    modifier?: string[]
    /** Specify how to match against the given modifiers array. Defaults to "Exact" */
    modifierMatchType?: ArrayMatchType
    /** Specify how to match SetType fields. Defaults to "SetType". */
    setMatchType?: SetMatchType
  }

export enum SetMatchType {
  /** setType fields are treated as a SetType object. Matches records that have the same SetType.
   *  If the setType is invalid, all fields in the object are ignored.
   */
  SetType = 'setType',
  /** setType fields are treated as individual filter fields.  */
  Filter = 'filter',
}
