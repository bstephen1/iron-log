export default interface BodyweightQuery {
  /** Treated as an absolute value (Negatives are the same as positives). 0 means no limit. */
  limit?: number
  /** ISO8601, e.g. '2020-04-02T08:02:17-05:00' */
  start?: string
  /** ISO8601, e.g. '2020-04-02T08:02:17-05:00' */
  end?: string
  /** filter results to only include official or unofficial weigh-ins */
  type?: 'official' | 'unofficial'
}
