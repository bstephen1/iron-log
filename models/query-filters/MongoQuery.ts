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
 * declaring the MatchTypes for a MongoQuery
 */
export type MatchTypes<T> = {
  [key in keyof Partial<T>]: MatchType
}

/** Contains possible api query types for non-primitive fields (eg, arrays, setType).
 *  All non-primitive fields share the same match type values, but exact implementation may
 *  differ between fields.
 */
export enum MatchType {
  Partial = 'partial',
  Exact = 'exact',
  Any = 'any',
}
