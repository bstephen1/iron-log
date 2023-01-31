export interface RecordQueryFrontend {
  /** YYYY-MM-DD */
  date?: string
  /** Exercise name.  */
  exercise?: string
}

/** This model must match what mongo expects for Filter<Exercise>  */
export interface RecordQueryBackend {
  /** YYYY-MM-DD */
  date?: string
  /** Mongo requires using a dot operator instead of a normal nested object, because the latter will match only
   * documents that that match that EXACT format (ie, no other fields exist) instead of matching any
   * document with the given field.
   */
  'exercise.name'?: string
}
