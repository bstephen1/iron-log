/** Additional options for data fetching. These must be destructured
 *  from any additional mongo Document filters or mongo will try to
 *  filter on these non-existant fields.
 */
export default interface FetchOptions {
  /** Limit the number of results. Treated as an absolute value (Negatives are the same as positives). 0 means no limit. */
  limit?: number
  /** YYYY-MM-DD */
  start?: string
  /** YYYY-MM-DD */
  end?: string
  /** defaults to "newestFirst" */
  sort?: 'oldestFirst' | 'newestFirst'
}
