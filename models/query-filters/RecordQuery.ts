import { DEFAULT_SET_TYPE, SetType } from 'models/Record'
import DateRangeQuery from './DateRangeQuery'
import { MatchType } from './MongoQuery'

/** Query to retrieve history for a given exercise in the frontend */
export type RecordHistoryQuery = SetType & {
  /** Exercise name.  */
  exercise: string
  /** Active modifier names */
  modifier: string[]
  /** Specify how to match against the given modifiers array. Defaults to "Exact" */
  modifierMatchType: MatchType
  /** Specify how to match SetType fields. Defaults to "SetType". */
  setTypeMatchType: MatchType
}

/** Generalized record query used in the api */
export type RecordQuery = Partial<RecordHistoryQuery> &
  Partial<SetType> &
  DateRangeQuery & {
    /** YYYY-MM-DD */
    date?: string
  }

export const DEFAULT_RECORD_HISTORY_QUERY: RecordHistoryQuery = {
  exercise: '',
  modifier: [],
  modifierMatchType: MatchType.Partial,
  setTypeMatchType: MatchType.Exact,
  ...DEFAULT_SET_TYPE,
}
