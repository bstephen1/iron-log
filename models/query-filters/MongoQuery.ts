import { Filter, ObjectId } from 'mongodb'

/** A query to send to mongo.  */
export interface MongoQuery<T> {
  /** Mongo equality filter. Should only contain exact matches.
   * Typed as filter because nested object fields should use mongo dot notation
   * (otherwise mongo tries to match on the exact subdocument given, which won't return anything) */
  filter?: Filter<T>
  /** limit the number of results */
  limit?: number
  /** start date */
  start?: string
  /** end date */
  end?: string
  /** Matches array fields corresponding to the given filter field with a schema for match type. */
  matchTypes?: MatchTypes<T>
  /** Required. Split out from the filter since the filter is optional. */
  userId: ObjectId
}

export type MatchTypes<T> = {
  [key in keyof Partial<T>]: ArrayMatchType
}

/** Contains possible query types for arrays.  */
export enum ArrayMatchType {
  /** matches records with any one of the provided values */
  Any = 'any',
  /** matches records with all of the provided values (but may have more) */
  All = 'all',
  /** matches records that only contain the provided values (but may not have all of them).
   * This option does not include records with a null or empty array
   */
  // Only = 'only',
  /** matches records that only contain the provided values (but may not have all of them).
   * This option includes records with a null or empty array
   */
  // OnlyWithNull = 'onlyWithNull',
  /** matches records that contain exactly the provided values list (combines All and Only) */
  Exact = 'exact',
}
