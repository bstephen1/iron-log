import { Filter, ObjectId } from 'mongodb'

/** A query to send to mongo.  */
export interface MongoQuery<T> {
  filter?: Filter<T>
  /** limit the number of results */
  limit?: number
  /** start date */
  start?: string
  /** end date */
  end?: string
  /** Matches array fields corresponding to the given filter field with a schema for match type. */
  matchTypes?: MatchTypes<T>
  sort?: 'oldestFirst' | 'newestFirst'
  /** Required. Split out from the filter since the filter is optional. */
  userId: ObjectId
}

/** An object that has keys corresponding to Partial\<T\> keys,
 * declaring the ArrayMatchTypes for a MongoQuery
 */
export type MatchTypes<T> = {
  [key in keyof Partial<T>]: MatchType
}

/** Contains possible query types for arrays and setTypes.  */
export enum MatchType {
  /** Matches records with at least all of the provided values (but may have more).
   *  For set types, this matches records with any set that matches the set type.
   */
  Partial = 'partial',
  /** matches records that contain exactly the provided values list, in any order.
   *  For set types, this matches records with the same set type.
   * This is treated as the default MatchType when one is not otherwise specified. */
  Exact = 'exact',
}
