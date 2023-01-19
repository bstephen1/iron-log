export interface BodyweightParams {
  /** Treated as an absolute value (Negatives are the same as positives). 0 means no limit. */
  limit?: number
  /** YYYY-MM-DD */
  start?: string
  /** YYYY-MM-DD */
  end?: string
}
