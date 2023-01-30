export default interface RecordQuery {
  /** YYYY-MM-DD */
  date?: string
  /** must use mongo dot operator instead of a normal nested object, because the latter will match only
   * documents that have that match that EXACT format (ie, no other fields exist)
   */
  'exercise.name'?: string
}
