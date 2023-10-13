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
  /** matches records that contain exactly the provided values list, in any order. */
  Equivalent = 'equivalent',
  /** matches records that contain exactly the provided array in the same order.
   * This is treated as the default ArrayMatchType when one is not otherwise specified. */
  Exact = 'exact',
}

export const ArrayMatchTypeDescription = {
  [ArrayMatchType.Any]: 'matches records with any one of the provided values',
  [ArrayMatchType.All]:
    'matches records with all of the provided values (but may have more)',
  [ArrayMatchType.Equivalent]:
    'matches records with exactly the provided values in any order',
  [ArrayMatchType.Exact]:
    'matches records with exactly the provided values in the same order',
  none: '',
}
