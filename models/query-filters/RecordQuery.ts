import dayjs from 'dayjs'
import { DATE_FORMAT } from '../../lib/frontend/constants'
import { DEFAULT_SET_TYPE, SetType } from '../Set'
import DateRangeQuery from './DateRangeQuery'
import { MatchType } from './MongoQuery'

/** Query to retrieve history for a given exercise in the frontend */
export type RecordHistoryQuery = SetType &
  DateRangeQuery & {
    /** Exercise name */
    exercise: string
    /** Active modifier names */
    modifier: string[]
    /** Specify how to match against the given modifiers array */
    modifierMatchType: MatchType
    /** Specify how to match SetType fields */
    setTypeMatchType: MatchType
  }

/** Generalized record query used in the api */
export type RecordQuery = Partial<RecordHistoryQuery> & {
  /** YYYY-MM-DD */
  date?: string
}

/** Default query for record history */
export const DEFAULT_RECORD_HISTORY_QUERY: RecordHistoryQuery = {
  exercise: '',
  modifier: [],
  modifierMatchType: MatchType.Partial,
  setTypeMatchType: MatchType.Any,
  end: dayjs().format(DATE_FORMAT),
  limit: 100,
  ...DEFAULT_SET_TYPE,
}
