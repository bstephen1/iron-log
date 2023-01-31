export default interface RecordQuery {
  /** YYYY-MM-DD */
  date?: string
  /** Mongo requires using a dot operator instead of a normal nested object, because the latter will match only
   * documents that that match that EXACT format (ie, no other fields exist) instead of matching any
   * document with the given field.
   */
  'exercise.name'?: string
  /** Exercise name. Equivalent to 'exercise.name'. If 'exercise.name' is present it is used instead.  */
  exercise?: string
}
