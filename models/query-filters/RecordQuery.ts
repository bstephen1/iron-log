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
  }
