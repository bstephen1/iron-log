import dayjs from 'dayjs'
import { DATE_FORMAT } from '../../lib/frontend/constants'
import { DEFAULT_SET_TYPE, SetType } from '../Set'
import { ArrayMatchType } from './ArrayMatchType'
import DateRangeQuery from './DateRangeQuery'

/** Query to retrieve history for a given exercise in the frontend */
export type RecordHistoryQuery = SetType &
  DateRangeQuery & {
    /** Exercise name */
    exercise: string
    /** Active modifier names */
    modifier: string[]
    /** Specify how to match against the given modifiers array */
    modifierMatchType: ArrayMatchType
    /** Specify how to match SetType fields */
    setTypeMatchType: ArrayMatchType
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
  modifierMatchType: ArrayMatchType.Partial,
  setTypeMatchType: ArrayMatchType.Any,
  end: dayjs().format(DATE_FORMAT),
  limit: 100,
  ...DEFAULT_SET_TYPE,
}
