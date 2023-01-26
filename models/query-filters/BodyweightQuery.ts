import DateRangeQuery from './DateRangeQuery'

export default interface BodyweightQuery extends DateRangeQuery {
  /** filter results to only include official or unofficial weigh-ins */
  type?: 'official' | 'unofficial'
}
