import { Filter } from 'mongodb'
import DateRangeQuery from './DateRangeQuery'

/** A query to send to mongo.  */
export interface MongoQuery<T> extends DateRangeQuery {
  filter?: Filter<T>
  /** Matches array fields corresponding to the given filter field with a schema for match type. */
  matchTypes?: MatchTypes<T>
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
